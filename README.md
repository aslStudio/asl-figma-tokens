# asl-figma-tokens

Выгружает опубликованные в файле Figma цветовые и текстовые стили в простой JSON. Node.js 20+; зависимостей нет.

```bash
npm install -D asl-figma-tokens
FIGMA_TOKEN=ваш_токен npx asl-figma-tokens FILE_KEY ./tokens.json
```

`FILE_KEY` берётся из URL `figma.com/file/FILE_KEY/...` или `figma.com/design/FILE_KEY/...`. Токену нужен scope `file_content:read` и доступ к файлу. Скрипт не записывает токен в результат. Имена сохраняются как в Figma. Цвета имеют вид `#RRGGBB` или `#RRGGBBAA`; текстовые стили содержат `fontFamily`, `fontWeight`, `fontSize`, `lineHeightPx`, `letterSpacing`.

```js
import { fetchFigmaTokens, parseFigmaStyles } from 'asl-figma-tokens'

const tokens = await fetchFigmaTokens(fileKey, process.env.FIGMA_TOKEN)
console.log(tokens.colors, tokens.typography)
```

Парсер сопоставляет `file.styles` с узлами документа по `node.styles`. Переменные Figma, эффекты и стили без использующего их узла в документе в результат не входят.
