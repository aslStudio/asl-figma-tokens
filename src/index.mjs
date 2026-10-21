export function parseFigmaStyles(file, styleNodes = {}) {
  const colors = {}
  const typography = {}
  const nodes = new Map()
  function visit(node) {
    if (!node || typeof node !== 'object') return
    if (node.id) nodes.set(node.id, node)
    for (const styleId of Object.values(node.styles ?? {})) nodes.set(styleId, node)
    for (const child of node.children ?? []) visit(child)
  }
  visit(file.document)
  for (const [id, style] of Object.entries(file.styles ?? {})) {
    const node = styleNodes[id] ?? nodes.get(id)
    if (!node) continue
    if (style.styleType === 'FILL') {
      const fill = (node.fills ?? []).find((item) => item.type === 'SOLID' && item.visible !== false)
      if (fill?.color) colors[style.name] = rgbaToHex(fill.color, fill.opacity ?? 1)
    }
    if (style.styleType === 'TEXT') {
      const text = node.style
      if (text) typography[style.name] = {
        fontFamily: text.fontFamily,
        fontWeight: text.fontWeight,
        fontSize: text.fontSize,
        lineHeightPx: text.lineHeightPx,
        letterSpacing: text.letterSpacing
      }
    }
  }
  return { colors, typography }
}

export function rgbaToHex(color, opacity = 1) {
  const rgb = ['r', 'g', 'b'].map((key) => Math.round(Math.max(0, Math.min(1, color[key])) * 255).toString(16).padStart(2, '0'))
  const alpha = Math.round(Math.max(0, Math.min(1, (color.a ?? 1) * opacity)) * 255)
  return `#${rgb.join('')}${alpha === 255 ? '' : alpha.toString(16).padStart(2, '0')}`.toUpperCase()
}

export async function fetchFigmaTokens(fileKey, token, fetchImpl = fetch) {
  if (!fileKey || !token) throw new Error('Figma file key and FIGMA_TOKEN are required')
  const headers = { 'X-Figma-Token': token }
  const base = `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}`
  const response = await fetchImpl(base, { headers })
  if (!response.ok) throw new Error(`Figma API: ${response.status} ${response.statusText}`)
  const file = await response.json()
  return parseFigmaStyles(file)
}
