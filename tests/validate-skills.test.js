/**
 * Validation tests for 10x-Team skills.
 *
 * Tests that every SKILL.md has the required structure, valid metadata,
 * and that cross-references between skills are correct.
 *
 * Zero dependencies — uses only Node.js built-ins.
 *
 * Usage:
 *   node tests/validate-skills.test.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const ORCHESTRATOR_SKILL = '10x-team';

// Required sections every skill must have.
// Each entry can be a string or an array of alternatives (any one must match).
const REQUIRED_SECTIONS = [
  'HARD-GATE',
  'Anti-Pattern',
  'Checklist',
  ['Process Flow', 'Delivery Flow'],
  'Key Principles',
  ['Anti-Patterns to Flag', 'Role Switching Rules'],
  'Tone',
  'Project State Protocol',
];

// Required frontmatter fields
const REQUIRED_FRONTMATTER = ['name', 'description'];

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (e) {
    console.log(`  FAIL: ${name}`);
    console.log(`    ${e.message}`);
    failed++;
  }
}

// ========== Discover skills ==========

function getSkillDirs() {
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

function readSkill(skillName) {
  const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
  if (!fs.existsSync(skillPath)) return null;
  return fs.readFileSync(skillPath, 'utf-8');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fields = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[key] = value;
  }
  return fields;
}

// ========== Run tests ==========

function runTests() {
  const skillDirs = getSkillDirs();

  // ========== 1. Every skill folder has a SKILL.md ==========
  console.log('\n--- Skill Files Exist ---');

  test('skills directory exists and is not empty', () => {
    assert(fs.existsSync(SKILLS_DIR), 'skills/ directory should exist');
    assert(skillDirs.length > 0, 'skills/ should contain at least one skill');
  });

  for (const skill of skillDirs) {
    test(`${skill}/ has a SKILL.md file`, () => {
      const skillPath = path.join(SKILLS_DIR, skill, 'SKILL.md');
      assert(fs.existsSync(skillPath), `${skill}/SKILL.md should exist`);
    });
  }

  // ========== 2. Validate frontmatter ==========
  console.log('\n--- Frontmatter Validation ---');

  for (const skill of skillDirs) {
    const content = readSkill(skill);
    if (!content) continue;

    test(`${skill}: has valid frontmatter block`, () => {
      assert(content.startsWith('---\n'), 'Should start with ---');
      const endIdx = content.indexOf('\n---', 4);
      assert(endIdx > 0, 'Should have closing ---');
    });

    const frontmatter = parseFrontmatter(content);

    for (const field of REQUIRED_FRONTMATTER) {
      test(`${skill}: frontmatter has "${field}"`, () => {
        assert(frontmatter, 'Frontmatter should be parseable');
        assert(frontmatter[field], `Should have "${field}" field`);
        assert(frontmatter[field].length > 0, `"${field}" should not be empty`);
      });
    }

    test(`${skill}: frontmatter "name" matches folder name`, () => {
      assert(frontmatter, 'Frontmatter should be parseable');
      assert.strictEqual(frontmatter.name, skill,
        `name "${frontmatter.name}" should match folder "${skill}"`);
    });

    test(`${skill}: description is meaningful (> 20 chars)`, () => {
      assert(frontmatter, 'Frontmatter should be parseable');
      assert(frontmatter.description.length > 20,
        `Description is too short (${frontmatter.description.length} chars)`);
    });
  }

  // ========== 3. Validate required sections ==========
  console.log('\n--- Required Sections ---');

  for (const skill of skillDirs) {
    const content = readSkill(skill);
    if (!content) continue;

    for (const section of REQUIRED_SECTIONS) {
      const alternatives = Array.isArray(section) ? section : [section];
      const label = alternatives.join(' or ');

      test(`${skill}: has "${label}" section`, () => {
        if (alternatives.includes('HARD-GATE')) {
          assert(content.includes('<HARD-GATE>'), 'Should have <HARD-GATE> opening tag');
          assert(content.includes('</HARD-GATE>'), 'Should have </HARD-GATE> closing tag');
        } else {
          const found = alternatives.some(alt => {
            const hasHeading = content.includes(`## ${alt}`) ||
                               content.includes(`### ${alt}`);
            const hasContent = content.includes(alt);
            return hasHeading || hasContent;
          });
          assert(found, `Should contain one of: ${alternatives.map(a => `"${a}"`).join(', ')}`);
        }
      });
    }
  }

  // ========== 4. HARD-GATE is not empty ==========
  console.log('\n--- HARD-GATE Content ---');

  for (const skill of skillDirs) {
    const content = readSkill(skill);
    if (!content) continue;

    test(`${skill}: HARD-GATE contains meaningful content`, () => {
      const match = content.match(/<HARD-GATE>([\s\S]*?)<\/HARD-GATE>/);
      assert(match, 'Should have HARD-GATE block');
      const gateContent = match[1].trim();
      assert(gateContent.length > 20,
        `HARD-GATE content is too short (${gateContent.length} chars)`);
    });
  }

  // ========== 5. Checklist has ordered steps ==========
  console.log('\n--- Checklist Structure ---');

  for (const skill of skillDirs) {
    const content = readSkill(skill);
    if (!content) continue;

    test(`${skill}: checklist has numbered steps`, () => {
      // Find the checklist section
      const checklistIdx = content.indexOf('## Checklist');
      const brainstormChecklistIdx = content.indexOf('### Brainstorming Checklist');
      const idx = checklistIdx !== -1 ? checklistIdx : brainstormChecklistIdx;
      assert(idx !== -1, 'Should have a Checklist section');

      // Get content between this heading and the next ## heading
      const afterChecklist = content.slice(idx);
      const nextSection = afterChecklist.indexOf('\n## ', 1);
      const checklistContent = nextSection !== -1
        ? afterChecklist.slice(0, nextSection)
        : afterChecklist;

      // Check for numbered items (1. **something**)
      const numberedItems = checklistContent.match(/^\d+\.\s+\*\*/gm);
      assert(numberedItems, 'Should have numbered bold items');
      assert(numberedItems.length >= 3,
        `Should have at least 3 steps, found ${numberedItems.length}`);
    });
  }

  // ========== 6. Process flow exists and has content ==========
  console.log('\n--- Process Flow ---');

  for (const skill of skillDirs) {
    const content = readSkill(skill);
    if (!content) continue;

    test(`${skill}: process flow has visual structure`, () => {
      const flowIdx = content.indexOf('## Process Flow') !== -1
        ? content.indexOf('## Process Flow')
        : content.indexOf('## Full Project Delivery Flow');
      assert(flowIdx !== -1, 'Should have a Process Flow or Delivery Flow section');

      const afterFlow = content.slice(flowIdx);
      // Should contain a code block with arrows or flow indicators
      const hasCodeBlock = afterFlow.includes('```');
      const hasArrows = afterFlow.includes('│') || afterFlow.includes('->') ||
                        afterFlow.includes('v') || afterFlow.includes('──');
      assert(hasCodeBlock || hasArrows,
        'Process flow should have a visual diagram (code block with arrows)');
    });
  }

  // ========== 7. Project State Protocol ==========
  console.log('\n--- Project State Protocol ---');

  for (const skill of skillDirs) {
    const content = readSkill(skill);
    if (!content) continue;

    test(`${skill}: has state read instructions`, () => {
      // Orchestrator uses "At Project Start", individual skills use "Before You Start"
      const hasReadInstructions = content.includes('Before You Start') ||
        content.includes('At Project Start');
      assert(hasReadInstructions,
        'Should have "Before You Start" or "At Project Start" instructions');
    });

    test(`${skill}: has state write instructions`, () => {
      // Orchestrator uses HARD-GATE checklists at each phase, individual skills use "Before You Finish"
      const hasWriteInstructions = content.includes('Before You Finish') ||
        content.includes('During Phase Transitions') ||
        content.includes('Before moving to Phase');
      assert(hasWriteInstructions,
        'Should have "Before You Finish", "During Phase Transitions", or phase-gate checklists');
    });

    test(`${skill}: state protocol references .10x/ files`, () => {
      assert(content.includes('.10x/decisions/'),
        'Should reference .10x/decisions/ folder');
      assert(content.includes('.10x/status.md'),
        'Should reference .10x/status.md');
      assert(content.includes('.10x/handoff.md'),
        'Should reference .10x/handoff.md');
    });
  }

  // ========== 8. Cross-reference validation ===========
  console.log('\n--- Cross-Reference Validation ---');

  const orchestratorContent = readSkill(ORCHESTRATOR_SKILL);

  test('orchestrator skill (10x-team) exists', () => {
    assert(orchestratorContent, '10x-team/SKILL.md should exist');
  });

  if (orchestratorContent) {
    // Extract all /skill-name references from orchestrator
    // Exclude command references (init-project, etc.) — only match skills that have SKILL.md
    const skillRefs = orchestratorContent.match(/`\/([a-z][a-z0-9-]*)`/g) || [];
    const referencedSkills = skillRefs.map(ref => ref.replace(/`\//g, '').replace(/`/g, ''));
    const uniqueRefs = [...new Set(referencedSkills)].filter(ref => {
      const skillPath = path.join(SKILLS_DIR, ref, 'SKILL.md');
      return fs.existsSync(skillPath);
    });

    test('orchestrator references at least 10 skills', () => {
      assert(uniqueRefs.length >= 10,
        `Expected at least 10 skill references, found ${uniqueRefs.length}: ${uniqueRefs.join(', ')}`);
    });

    for (const ref of uniqueRefs) {
      test(`orchestrator reference "/${ref}" has matching skill folder`, () => {
        const skillPath = path.join(SKILLS_DIR, ref, 'SKILL.md');
        assert(fs.existsSync(skillPath),
          `Referenced skill "${ref}" should have a SKILL.md at skills/${ref}/SKILL.md`);
      });
    }

    // Check that every non-orchestrator skill is referenced by the orchestrator
    const nonOrchestratorSkills = skillDirs.filter(s => s !== ORCHESTRATOR_SKILL);

    for (const skill of nonOrchestratorSkills) {
      test(`skill "${skill}" is referenced by orchestrator`, () => {
        assert(uniqueRefs.includes(skill),
          `Skill "${skill}" exists but is not referenced in 10x-team orchestrator`);
      });
    }
  }

  // ========== 9. Plugin manifest validation ==========
  console.log('\n--- Plugin Manifest ---');

  const pluginPath = path.join(__dirname, '..', '.claude-plugin', 'plugin.json');

  test('plugin.json exists', () => {
    assert(fs.existsSync(pluginPath), '.claude-plugin/plugin.json should exist');
  });

  test('plugin.json is valid JSON', () => {
    const content = fs.readFileSync(pluginPath, 'utf-8');
    JSON.parse(content); // Throws if invalid
  });

  test('plugin.json has required fields', () => {
    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf-8'));
    assert(plugin.name, 'Should have name');
    assert(plugin.version, 'Should have version');
    assert(plugin.description, 'Should have description');
  });

  // ========== 10. No broken internal references ==========
  console.log('\n--- Internal Consistency ---');

  test('README.md skill table matches actual skills', () => {
    const readmePath = path.join(__dirname, '..', 'README.md');
    const readme = fs.readFileSync(readmePath, 'utf-8');

    for (const skill of skillDirs) {
      assert(readme.includes(`/${skill}`),
        `README should reference /${skill}`);
    }
  });

  // ========== Summary ==========
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) process.exit(1);
}

runTests();
