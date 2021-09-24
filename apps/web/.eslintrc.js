module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-closing-bracket-location': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-console': 'off',
  },
  globals: {
    React: 'writable',
  },
};
