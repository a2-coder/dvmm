---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "DVMM"
  text: "Domain-View Model Mapper"
  tagline: Frontend architecture pattern for clean separation of backend and UI models using mappers.
  actions:
    - theme: brand
      text: What is DVMM?
      link: /what-is-dvmm
    - theme: alt
      text: Quickstart
      link: /getting-started
    - theme: alt
      text: Examples
      link: /examples

features:
  - title: Clear Model Separation
    details: Distinguish backend (domain) models from frontend (view) models for maintainable, scalable code.
  - title: Deterministic Mapping
    details: Use dedicated mappers to convert between API and UI models, ensuring data consistency and type safety.
  - title: Parallel Development
    details: Enable backend and frontend teams to work independently by decoupling data contracts from UI needs.
  - title: TypeScript First
    details: Designed for TypeScript projects and compatible with frameworks like React, Vue, and Angular.
  - title: Testable Logic
    details: Mapping logic is easily unit tested, reducing bugs and improving confidence in data transformations.
  - title: Best Practices Included
    details: Enforces naming conventions and folder structure for a clean, predictable codebase.
---