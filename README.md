# TemenCAD product site

The product page for [TemenCAD](https://github.com/belteshazzar/TemenCAD), published at https://belteshazzar.github.io/TemenCAD-web/.

The hero demo is real: the engine from the app package (`temencad` from GitHub) runs in a web worker on the page and builds the example scripts, shown with the app's own viewer. The catalogue section reads the live `index.json` from the [catalogue site](https://belteshazzar.github.io/TemenCAD-catalog/).

```sh
npm install
npm run dev       # local preview
npm run build     # dist/
npm run og        # re-render public/og.png and public/hero.png from the demo examples (no browser needed)
```

Pushing to `main` builds and deploys with the workflow in `.github/workflows/deploy.yml`. Plain HTML, CSS and a little JavaScript; no framework, no tracking.
