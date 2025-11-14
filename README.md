# Urban Institute Mapping Application

[Regional Explorer Website](https://regionalexplorer.netlify.app)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.6.

## Development server (Windows-friendly)

Prereqs
- Node.js 18 LTS or 20+ (recommended)
- npm 10+

Install dependencies:

```powershell
npm install
```

Start the dev server (pick one):

- Via VS Code task: Run the task “npm: start”.
- Via terminal (bypasses Group Policy blocks on `ng`):

```powershell
node .\node_modules\@angular\cli\bin\ng.js serve
```

Then open:

- http://localhost:4200/

The app hot-reloads on file save. If HMR seems stuck, press Ctrl+C to stop and re-run the serve command with `--no-hmr`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

Create a build into `dist/`:

```powershell
node .\node_modules\@angular\cli\bin\ng.js build
```

This produces a production-optimized bundle by default.

## Running unit tests

Run tests with Karma (using the local CLI entrypoint):

```powershell
node .\node_modules\@angular\cli\bin\ng.js test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Feature: Variable Line Chart (time series)

The Regional Explorer includes a first visualization: a line chart that shows the selected variable over time for the currently selected location.

How to try it:
1. Start the app (see Development server above) and open `http://localhost:4200/`.
2. In the toolbar, choose a variable (e.g., “Population – Youth”).
3. Use the Search box to select a place; the map will outline it.
4. Scroll below the Time Slider to “Trend: <Variable>”. A line chart renders years on the X‑axis and values on the Y‑axis for that location.
5. Switch to another variable; the chart updates automatically. Clear the selection to reset the chart.

Notes
- Values come from the all‑years FeatureLayer and respect each variable’s `yearsAvailable`.
- Percentage variables display a % axis label; other types show raw values.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
