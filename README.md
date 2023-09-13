# ruff-report

ruff-report is a tool to visualize your [ruff] report in your browser.

## Usage

### Online

To get started, the easiest option is [the online version](https://akx.github.io/ruff-report) – don't worry,
your report will be processed locally in your browser, and not sent to any server.

### Locally

This project is built with Vite, so you can just clone the repository, install deps with whatever JavaScript
package manager you prefer, and run the `dev` script to start a local development server.

### Standalone mode

`ruff-report` also supports a standalone mode, in which the entire application is bundled into a single HTML
file with the superpower to look for a `ruff-report.js` file in the same directory as itself, and load it
as the report data.

To build the standalone `ruff-report-standalone.html` file, run `make standalone`.
You can also find the latest bleeding-edge standalone build as a GitHub Actions artifact.
