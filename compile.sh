npx tsc --outFile site/static/counterspell.js counterspell.ts --lib es2015,dom
cp node_modules/normalize.css/normalize.css site/static/normalize.css
cp counterspell.html site/index.html
