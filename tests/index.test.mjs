import test from 'node:test'
import assert from 'node:assert/strict'
import { parseFigmaStyles, rgbaToHex } from '../src/index.mjs'

test('reads color and text styles from the Figma document', () => {
  const file = {
    styles: { c: { name: 'Brand/Primary', styleType: 'FILL' }, t: { name: 'Body', styleType: 'TEXT' } },
    document: { children: [
      { styles: { fill: 'c' }, fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 0.5 } }] },
      { styles: { text: 't' }, style: { fontFamily: 'Inter', fontSize: 16, fontWeight: 400 } }
    ] }
  }
  const tokens = parseFigmaStyles(file)
  assert.equal(tokens.colors['Brand/Primary'], '#FF000080')
  assert.equal(tokens.typography.Body.fontFamily, 'Inter')
  assert.equal(rgbaToHex({ r: 0, g: 0, b: 1 }), '#0000FF')
})
