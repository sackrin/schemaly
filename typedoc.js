module.exports = {
  theme: 'default',
  out: './docs/',
  readme: 'README.md',
  includes: './',
  exclude: [
    '**/index.ts',
    '**/__tests__/**/*'
  ],
  target: 'ES6',
  mode: 'modules',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: false,
  ignoreCompilerErrors: true
};
