module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-no-hex': true,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'variants', 'responsive', 'screen'],
      },
    ],
    'declaration-property-value-allowed-list': {
      color: ['/^var\\(--tee-/', 'transparent', 'inherit', 'currentColor'],
      background: ['/^var\\(--tee-/', 'transparent', 'inherit', '/^linear-gradient/'],
      'background-color': ['/^var\\(--tee-/', 'transparent', 'inherit'],
      'border-color': ['/^var\\(--tee-/', 'transparent', 'inherit'],
    },
  },
  overrides: [
    {
      files: ['src/app/global.css'],
      rules: {
        'color-no-hex': null,
        'declaration-property-value-allowed-list': null,
      },
    },
  ],
};
