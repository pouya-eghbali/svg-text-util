const { svg } = require("./index")

const buffer = svg(1000, 0, 20)
  .text('TEXT', { font: 'Hack', size: 72, color: 'rgb(100, 50, 200)', align: 'left' })
  .text('TEXT', { font: 'Hack', size: 72, color: 'green', align: 'center' })
  .text('TEXT', { font: 'Hack', size: 72, color: '#CC44AA', align: 'right' })
  .white(50)
  .text('long and centered '.repeat(10), { size: 32, color: 'pink', align: 'center' })
  .buffer()

const sharp = require("sharp")

sharp(buffer)
  .png()
  .toFile(`${__dirname}/test.png`)
