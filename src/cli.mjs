#!/usr/bin/env node
import { writeFile } from 'node:fs/promises'
import { fetchFigmaTokens } from './index.mjs'

const [fileKey, output = 'figma-tokens.json'] = process.argv.slice(2)
if (!fileKey || process.argv.includes('--help')) {
  console.log('Usage: FIGMA_TOKEN=... asl-figma-tokens <file-key> [output.json]')
  process.exit(fileKey ? 0 : 1)
}
try {
  const tokens = await fetchFigmaTokens(fileKey, process.env.FIGMA_TOKEN)
  await writeFile(output, `${JSON.stringify(tokens, null, 2)}\n`)
  console.log(`Wrote ${output}: ${Object.keys(tokens.colors).length} colors, ${Object.keys(tokens.typography).length} text styles`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
