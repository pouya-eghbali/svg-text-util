# SVG Text Util

Just a simple library to make textual svgs.

## Usage

```javascript
const { svg } = require("svg-text-util")

const buffer = svg(1000, 400) // width, height
  .text('TEXT', { size: 72, color: 'red', align: 'left' })
  .text('TEXT', { size: 72, color: 'green', align: 'center' })
  .text('TEXT', { size: 72, color: 'blue', align: 'right' })
  .white(50)
  .text('long and centered '.repeat(10), { size: 32, color: 'pink', align: 'center' })
  .buffer()

const sharp = require("sharp")

sharp(buffer)
  .png()
  .toFile(`${__dirname}/test.png`)
```

Set height to `0` to automatically calculate the height.

## Public methods

text: Add text

```
.text(text: string, { size?: number ~12, color?: string = name|hex ~black, align?: string = left|right|center ~center }) -> undefined
```

white: Add whitespace

```
.white(size?: number ~50) -> undefined
```

svg: Get svg source

```
.svg() -> string
```

buffer: Get a buffer with svg content in it
```
.buffer() -> buffer
```
