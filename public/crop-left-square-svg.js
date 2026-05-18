const fs = require('fs')

const input = process.argv[2]
const output = process.argv[3] || 'symbol-only.svg'
const padding = Number(process.argv[4] || 0)

if (!input) {
  console.error('Usage: node crop-left-square-svg.js input.svg output.svg [padding]')
  process.exit(1)
}

let svg = fs.readFileSync(input, 'utf8')

function getAttr(source, name) {
  const match = source.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'))
  return match ? match[1] : null
}

function setAttr(source, name, value) {
  const regex = new RegExp(`${name}=["'][^"']*["']`, 'i')

  if (regex.test(source)) {
    return source.replace(regex, `${name}="${value}"`)
  }

  return source.replace('<svg', `<svg ${name}="${value}"`)
}

function numberOnly(value) {
  if (!value) return null
  return Number(String(value).replace(/[a-z%]+$/i, ''))
}

const svgOpenTagMatch = svg.match(/<svg\b[^>]*>/i)

if (!svgOpenTagMatch) {
  console.error('No <svg> tag found')
  process.exit(1)
}

const originalTag = svgOpenTagMatch[0]

const viewBox = getAttr(originalTag, 'viewBox')
const width = numberOnly(getAttr(originalTag, 'width'))
const height = numberOnly(getAttr(originalTag, 'height'))

let x = 0
let y = 0
let w
let h

if (viewBox) {
  const parts = viewBox.trim().split(/[\s,]+/).map(Number)

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    console.error('Invalid viewBox')
    process.exit(1)
  }

  x = parts[0]
  y = parts[1]
  w = parts[2]
  h = parts[3]
} else {
  if (!width || !height) {
    console.error('No viewBox and no valid width/height found')
    process.exit(1)
  }

  w = width
  h = height
}

// crop quadrato: lato = altezza
// padding negativo stringe, padding positivo allarga
const size = h + padding

if (size <= 0) {
  console.error('Invalid crop size. Padding is too negative.')
  process.exit(1)
}

let newTag = originalTag

newTag = setAttr(newTag, 'viewBox', `${x} ${y} ${size} ${h}`)
newTag = setAttr(newTag, 'width', `${size}`)
newTag = setAttr(newTag, 'height', `${h}`)

svg = svg.replace(originalTag, newTag)

fs.writeFileSync(output, svg)

console.log(`Created: ${output}`)
console.log(`Original viewBox/size: ${w} x ${h}`)
console.log(`New crop: ${size} x ${h}`)
