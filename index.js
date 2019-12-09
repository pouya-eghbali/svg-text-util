const pixelWidth = require('string-pixel-width');

class SVG {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.tspans = []
  }
  white(size) {
    size = size || 50
    this.line('', { size })
    return this
  }
  line(text, { size, color, align, font }) {
    size = size || 12
    color = color || '#000000'
    font = font || 'Arial'
    const x = this[align || 'left'](text, size, font)
    const tspan = `<tspan dy="${size}" x="${x}" font-size="${size}" fill="${color}" font-family="${font}">${text}</tspan>`
    this.tspans.push(tspan)
    return this
  }
  text(text, { size, color, align, font }) {
    const lines = this.toLines(text, size || 12, font || 'Arial')
    lines.forEach(line => this.line(line, { size, color, align, font }))
    return this
  }
  toLines(text, size, font) {
    const words = text.split(' ').filter(Boolean)
    const lines = []
    let line = []
    while (true) {
      line.push(words.shift())
      if (this.textWidth(line.join(' '), size, font) > this.width) {
        words.unshift(line.pop())
        lines.push(line.join(' '))
        line = []
      }
      if (!words.length) {
        lines.push(line.join(' '))
        return lines
      }
    }
  }

  svg() {
    return `
    <svg
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="${this.width}" height="${this.height}">
      <text>
        ${this.tspans.join('\n')}
      </text>
    </svg>`
  }

  buffer() {
    const svg = this.svg()
    const svgBuffer = Buffer.from(svg)
    return svgBuffer
  }

  left(text, size, font) {
    return 0
  }
  right(text, size, font) {
    return this.width - this.textWidth(text, size, font)
  }
  center(text, size, font) {
    return (this.width - this.textWidth(text, size, font)) / 2
  }

  textWidth(text, size, font) {
    return pixelWidth(text, { size, font })
  }
}

const svg = (...args) => new SVG(...args)

module.exports = { svg }
