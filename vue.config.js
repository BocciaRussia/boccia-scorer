module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessFile: 'src/background.ts',

      mainProcessArgs: ['--disable-setuid-sandbox', '--disable-gpu-sandbox', '--no-sandbox']
    }
  }
}
