npx tsc --outFile docs/static/counterspell.js counterspell.ts --lib es2015,dom
cp node_modules/normalize.css/normalize.css docs/static/normalize.css
cp counterspell.html docs/index.html
cp counterspell.css docs/static/counterspell.css
