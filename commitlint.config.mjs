export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // ============================================
    // TYPE VALIDATION
    // ============================================
    'type-enum': [
      2,
      'always',
      [
        'feat',       // ✨ New feature for the user
        'fix',        // 🐛 Bug fix
        'hotfix',     // 🚑 Critical hotfix
        'docs',       // 📝 Documentation only changes
        'style',      // 💄 Formatting, missing semi colons, etc; no code change
        'refactor',   // ♻️  Refactoring production code
        'perf',       // ⚡ Performance improvements
        'test',       // ✅ Adding missing tests or correcting existing tests
        'build',      // 📦 Build system or external dependencies changes
        'ci',         // 👷 CI/CD configuration files and scripts
        'chore',      // 🔧 Other changes that don't modify src or test files
        'revert',     // ⏪ Revert previous commit
        'security',   // 🔒 Security improvements or fixes
        'deps',       // ⬆️  Dependency updates
        'config',     // ⚙️  Configuration changes
        'wip',        // 🚧 Work in progress (use sparingly)
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // ============================================
    // SCOPE VALIDATION
    // ============================================
    'scope-enum': [
      2,
      'always',
      [
        // Core modules
        'api',
        'web',
        'frontend',
        
        // API services
        'benchmarks',
        'capability-matching',
        'model-catalog',
        'pricing',
        'suggestions',
        
        // Infrastructure
        'database',
        'prisma',
        'docker',
        'deployment',
        
        // Frontend components/pages
        'components',
        'pages',
        'layout',
        'hooks',
        'utils',
        'types',
        
        // Tooling & Configuration
        'husky',
        'eslint',
        'typescript',
        'tests',
        'ci',
        'build',
        'deps',
        'config',
        
        // Documentation
        'docs',
        'readme',
        
        // Multiple scopes
        'monorepo',
        'workspace',
        
        // Release related
        'release',
        'changelog',
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [1, 'never'], // Warning: scope is recommended

    // ============================================
    // SUBJECT (COMMIT MESSAGE) VALIDATION
    // ============================================
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-min-length': [2, 'always', 10],
    'subject-max-length': [2, 'always', 72],
    'subject-exclamation-mark': [2, 'never'],

    // ============================================
    // HEADER (TYPE + SCOPE + SUBJECT) VALIDATION
    // ============================================
    'header-max-length': [2, 'always', 100],
    'header-min-length': [2, 'always', 15],

    // ============================================
    // BODY VALIDATION
    // ============================================
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'body-min-length': [0, 'always', 0], // Body is optional
    'body-case': [0, 'always', 'sentence-case'],

    // ============================================
    // FOOTER VALIDATION
    // ============================================
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 100],

    // ============================================
    // REFERENCES VALIDATION
    // ============================================
    'references-empty': [0, 'never'], // Optional issue references
  },
  
  // ============================================
  // CUSTOM PLUGINS & HELP MESSAGES
  // ============================================
  helpUrl: 'https://github.com/Noname01010101/ai-store/blob/main/GIT_HOOKS.md',
  
  // Custom prompt messages
  prompt: {
    messages: {
      skip: ':skip',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'can not be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit',
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing",
      },
      scope: {
        description: 'What is the scope of this change (e.g. component or file name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description: 'If issues are closed, the commit requires a body. Please enter a longer description',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123")',
      },
    },
  },
};
