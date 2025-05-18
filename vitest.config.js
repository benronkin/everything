export default {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.js',
    include: ['docs/**/*.test.js'],
    exclude: ['node_modules', 'dist'],
  },
}
