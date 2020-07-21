const { getWidth } = require("text-pixel-width");
const xmlescape = require("xml-escape");

class SVG {
  constructor(width, height, padding) {
    this.width = width;
    this.height = height;
    this.padding = padding || 0;
    this.tspans = [];
    this.autoHeight = height == 0;
    this.whiteSpace = 0;
  }
  white(size) {
    this.whiteSpace += size || 50;
    if (this.autoHeight) this.height += size;
    return this;
  }
  line(text, { size, color, align, font }) {
    size = size || 12;
    color = color || "#000000";
    font = font || "Arial";
    const x = this[align || "left"](text, size, font);
    text = xmlescape(text);
    const tspan = `<tspan dy="${size + this.whiteSpace}" x="${
      x + this.padding
    }" font-size="${size}px" fill="${color}" font-family="${font}">${text}</tspan>`;
    if (this.autoHeight) this.height += size;
    this.tspans.push(tspan);
    this.whiteSpace = 0;
    return this;
  }
  text(text, { size, color, align, font }) {
    const lines = this.toLines(text, size || 12, font || "Arial");
    lines.forEach((line) => this.line(line, { size, color, align, font }));
    return this;
  }
  toLines(text, size, font) {
    const words = text.split(" ").filter(Boolean);
    const lines = [];
    let line = [];
    let failed = 0;
    while (true) {
      line.push(words.shift());
      if (this.textWidth(line.join(" "), size, font) > this.width) {
        words.unshift(line.pop());
        lines.push(line.join(" "));
        line = [];
        failed++;
      }
      if (failed == 2) {
        line.push(words.shift());
        failed = 0;
      }
      if (!words.length) {
        lines.push(line.join(" "));
        return lines;
      }
    }
  }

  svg() {
    return `
    <svg
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="${this.width + this.padding * 2}"
      height="${this.height + this.padding * 2}">
      <text y="${this.padding}">
        ${this.tspans.join("\n")}
      </text>
    </svg>`;
  }

  buffer() {
    const svg = this.svg();
    const svgBuffer = Buffer.from(svg);
    return svgBuffer;
  }

  left(text, size, font) {
    return 0;
  }
  right(text, size, font) {
    return this.width - this.textWidth(text, size, font);
  }
  center(text, size, font) {
    return (this.width - this.textWidth(text, size, font)) / 2;
  }

  textWidth(text, size, font) {
    return getWidth(text, font, size);
  }
}

const svg = (...args) => new SVG(...args);

module.exports = { svg };
