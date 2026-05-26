export default {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.js',
    include: ['docs/**/*.test.js'],
    exclude: ['node_modules', 'dist']
  },
  define: {
    'process.env.AUTH_TOKEN': JSON.stringify(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZW50IjoiYmEyMDIwYUB5YWhvby5jb20iLCJpYXQiOjE3NDk0OTI5ODh9.AHywnr4aQGEEXvEIpW21mltBO6mZuX8l1yEIfFrMqoQ'
    )
  }
}
