export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    disabled: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})