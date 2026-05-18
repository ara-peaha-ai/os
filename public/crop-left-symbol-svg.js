const fs = require('fs')

const input = process.argv[2]
const output = process.argv[3] || 'symbol-only.svg'

// aumenta questo se il simbolo viene tagliato
const cropMultiplier = Number(process.argv[4] || 1.15)

if (!input) {
  console.error('Usage: node crop-left-symbol-svg.js input.svg output.svg [cropMultiplier]')
  process.exit(1)
}

let svg = fs.readFileSync(input, 'utf8')

function getAttr(source, name) {
  const match = source.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'))
  return match ? match[1] : null
}

function numberOnly(value) {
  return Number(String(value).replace(/[a-z%]+$/i, ''))
}

const svgOpenTag = svg.match(/<svg\b[^>]*>/i)

if (!svgOpenTag) {
  console.error('No <svg> tag found')
  process.exit(1)
}

let tag = svgOpenTag[0]

const viewBox = getAttr(tag, 'viewBox')
const width = numberOnly(getAttr(tag, 'width'))
const height = numberOnly(getAttr(tag, 'height'))

let x = 0
let y = 0
let w
let h

if (viewBox) {
  const parts = viewBox.trim().split(/[\s,]+/).map(Number)
  x = parts[0]
  y = parts[1]
  w = parts[2]
  h = parts[3]
} else {
  w = width
  h = height
}

if (!w || !h) {
  console.error('Could not detect SVG width/height or viewBox')
  process.exit(1)
}

// quadrato sulla parte sinistra
const size = h * cropMultiplier

let newTag = tag

if (viewBox) {
  newTag = newTag.replace(/viewBox=["'][^"']+["']/i, `viewBox="${x} ${y} ${size} ${size}"`)
} else {
  newTag = newTag.replace('<svg', `<svg viewBox="${x} ${y} ${size} ${size}"`)
}

if (getAttr(newTag, 'width')) {
  newTag = newTag.replace(/width=["'][^"']+["']/i, `width="${size}"`)
} else {
  newTag = newTag.replace('<svg', `<svg width="${size}"`)
}

if (getAttr(newTag, 'height')) {
  newTag = newTag.replace(/height=["'][^"']+["']/i, `height="${size}"`)
} else {
  newTag = newTag.replace('<svg', `<svg height="${size}"`)
}

svg = svg.replace(tag, newTag)

fs.writeFileSync(output, svg)

console.log(`Created: ${output}`)
console.log(`Crop square size: ${size}`)