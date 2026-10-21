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

## Разработка и публикация

Этот каталог является отдельным Git-репозиторием и самостоятельным npm-пакетом. Команды выполняются из его корня.

```bash
npm ci
npm test
npm run pack:check
npm login
npm publish --access public
```

Перед публикацией проверьте право на использование исходного кода и выберите лицензию. Сейчас в `package.json` указано `UNLICENSED`. Проверьте, что имя пакета доступно в npm; при необходимости измените `name` и заново выполните `npm install`. Для следующего релиза повысьте версию через `npm version patch`.

Для GitHub создайте пустой репозиторий с таким же именем, затем добавьте его как `origin` и отправьте ветку: `git remote add origin <адрес>`, `git push -u origin main`.
