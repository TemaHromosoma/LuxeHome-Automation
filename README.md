# LuxeHome – QA Automation

Test automation suite for the **LuxeHome** e-commerce demo, focused on its two pages - the **Product Detail Page (PDP)** and the **Cart** - with functional, negative and edge-case scenarios, accessibility (WCAG 2.1 AA) and performance testing in a single, structured framework.

> **System under test:** https://daristr.github.io/luxehome-qa
> Built as part of a structured QA training track (manual + automation).

---

## Overview

This repository is the automation layer of a collaborative QA project on the LuxeHome storefront. The suite goes deep on its two pages - the **Product Detail Page (PDP)** and the **Cart**. It was built by two QA engineers; the **Cart** coverage and k6 performance tests in this suite is my area of responsibility.

The goal was to build coverage the way it would be structured on a real product team: a maintainable Page Object Model, clear separation of test data, and testing that goes beyond the happy path into negative cases accessibility and load.

The suite is split into four complementary layers:

| Layer | Tooling | What it checks |
|---|---|---|
| **Functional & UI** | Playwright + TypeScript | PDP and Cart flows, edge cases, negative scenarios |
| **Accessibility** | `@axe-core/playwright` | WCAG 2.1 AA violations on the PDP and Cart pages |
| **Performance / load** | k6 | Behaviour under 1, 10 and 100 virtual users |
| **Page quality audit** | Lighthouse | Performance, accessibility, best-practices, SEO scores |

---

## Tech stack

- **Playwright** (`@playwright/test`) with **TypeScript** (ESM)
- **Page Object Model** architecture with shared helpers and externalised test data
- **axe-core / @axe-core/playwright** for automated accessibility checks
- **k6** for load and performance testing across multiple profiles
- **Lighthouse** (+ `chrome-launcher`) for page-quality audits
- HTML reporter with trace capture on first retry; CI-aware configuration

---

## Project structure

```
LuxeHome-Automation/
├── tests/                 # Playwright specs (functional, negative, edge-case, a11y)
├── pages/                 # Page Object Model classes
├── helpers/               # Shared utilities and custom helpers
├── test_data/             # Externalised test data
├── k6/                    # Performance scripts + Lighthouse audit
│   ├── framework-1-user.js
│   ├── framework-10-users.js
│   ├── framework-100-users.js
│   ├── framework-combined.js
│   └── lighthouse-check.js
├── playwright.config.ts   # Base URL, projects, HTML reporter, retries/trace
├── tsconfig.json
└── package.json
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) installed separately
  (Playwright tests run without it; only the `test:*users` scripts need it)

### Installation

```bash
git clone https://github.com/TemaHromosoma/LuxeHome-Automation.git
cd LuxeHome-Automation
npm install
npx playwright install   # download browser binaries
```

---

## Running the tests

| Command | Description |
|---|---|
| `npm run test:playwright` | Run the Playwright suite (functional + accessibility) |
| `npm run test:1user` | k6 load test — 1 virtual user (baseline) |
| `npm run test:10users` | k6 load test — 10 virtual users |
| `npm run test:100users` | k6 load test — 100 virtual users (stress) |
| `npm run test:combined` | k6 combined load profile |
| `npm run lighthouse` | Lighthouse page-quality audit |
| `npm run test:all` | Lighthouse audit + combined k6 run |

After a Playwright run, open the generated HTML report:

```bash
npx playwright show-report
```

---

## Test coverage

**Functional & negative**
Coverage targets the Product Detail Page and the Cart - the high-impact steps in the purchase flow - combining happy-path checks with deliberately negative and edge-case scenarios to surface validation and boundary defects.

**Accessibility (WCAG 2.1 AA)**
Automated axe-core scans on the PDP and Cart pages, flagging contrast, labelling, structure and keyboard-accessibility issues against the WCAG 2.1 AA ruleset.

**Performance (k6)**
Load profiles scaling from a single-user baseline to 100 concurrent virtual users, measuring response times and failure rates to identify how the site behaves under increasing traffic.

**Page quality (Lighthouse)**
Programmatic Lighthouse audits scoring performance, accessibility, best practices and SEO.

---

## Notes

- Browsers: the `chromium` project is enabled by default; Firefox and WebKit projects are scaffolded in `playwright.config.ts` and can be enabled by uncommenting them.

---

## Authors

Built collaboratively by two QA engineers, with divided page ownership:

- **Artem Yakovyshyn** — Junior QA Engineer (Manual & Automation) · Cart-page coverage
  — [@TemaHromosoma](https://github.com/TemaHromosoma)
- **Claudia Elena Pitu** — Product Detail Page (PDP) coverage
  — [@pituclaudia7-arch](https://github.com/pituclaudia7-arch)
