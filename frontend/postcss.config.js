export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // CSS optimization plugins
    ...(process.env.NODE_ENV === 'production' ? {
      'cssnano': {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
          minifySelectors: true,
        }]
      }
    } : {})
  },
}
