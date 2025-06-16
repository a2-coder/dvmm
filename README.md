# DVMM

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15671574.svg)](https://doi.org/10.5281/zenodo.15671574)

**DVMM (Domain-View Model Mapper)** is a frontend architecture pattern for TypeScript projects. It separates backend data models (domain models) from UI models (view models) using dedicated mappers. This separation leads to cleaner code, easier maintenance, and enables backend and frontend teams to work in parallel.

## Core Concepts

- **Domain Model**: Represents the backend API response structure. Mirrors the data contract from the server.
- **View Model**: Represents the data structure needed by the frontend UI. Tailored for UI needs, not backend constraints.
- **Mapper**: Contains logic to convert between domain and view models, ensuring deterministic and testable data transformations.

## Why and When Should You Use DVMM?

- **When your backend and frontend evolve independently**: DVMM decouples backend changes from UI changes.
- **When your UI needs data in a different shape than the API provides**: View models can be optimized for rendering, formatting, or state.
- **When you want to enforce type safety and reduce bugs**: Explicit mapping makes data flow predictable and testable.
- **When working in teams**: Backend and frontend developers can work in parallel without blocking each other.

## Best Practices

- **Keep Domain Models strictly aligned with backend contracts.**
- **Shape View Models for UI needs only.**
- **Never use Domain Models directly in UI components.**
- **Write deterministic, unit-testable mappers.**
- **Follow clear naming conventions and folder structure.**