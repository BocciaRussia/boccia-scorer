const icongen = require('icon-gen')

icongen('./src/assets/icon.svg', './build', {
    report: true,
    ico: {
        name: 'icon',
        sizes: [16, 24, 32, 48, 64, 128, 256]
    },
    icns: {
        name: 'icon',
        sizes: [16, 32, 64, 128, 256, 512, 1024]
    },
})
    .then((results) => {
        console.log(results)
    })
    .catch((err) => {
        console.error(err)
    })