# Introduction

`@grekt-labs/cli-engine` is the deterministic core logic library that powers grekt. It contains all the business logic for artifact management (scanning, parsing, registry operations, syncing, versioning, and more) without performing any I/O directly.

## Why cli-engine?

The engine is designed around a key principle: **determinism through dependency injection**. All external operations (file system, HTTP, shell commands) are injected via interfaces. This means:

- **Same inputs always produce the same outputs.** No hidden side effects
- **Runs anywhere.** CLI, browser, test environments, serverless functions
- **Easy to test.** Swap real implementations with mocks
- **Easy to extend.** Implement the interfaces for your platform

## Who is this for?

This documentation is for developers building integrations with grekt:

- **Custom CLIs** - build specialized tools on top of cli-engine
- **Browser tools** - use cli-engine in web-based artifact managers
- **CI/CD integrations** - automate artifact operations in pipelines
- **Test utilities** - use mock implementations for testing artifact workflows
- **Editor plugins** - integrate grekt capabilities into IDEs

## Module overview

| Module | Purpose |
|--------|---------|
| [Core interfaces](/en-US/docs/core/interfaces) | Dependency injection contracts |
| [EngineContext](/en-US/docs/core/engine-context) | Unified context object |
| [Categories](/en-US/docs/core/categories) | Artifact component type definitions |
| [Schemas](/en-US/docs/modules/schemas) | Zod validation schemas and inferred types |
| [Artifact](/en-US/docs/modules/artifact) | Scanner, frontmatter, naming, integrity |
| [Registry](/en-US/docs/modules/registry) | Source parsing, resolution, clients |
| [Sync](/en-US/docs/modules/sync) | SyncPlugin interface, constants |
| [Artifact index](/en-US/docs/modules/artifact-index) | Index generation for lazy loading |
| [OCI](/en-US/docs/modules/oci) | OCI Distribution client (GHCR) |
| [Version](/en-US/docs/modules/version) | Semver utilities |
| [Formatters](/en-US/docs/modules/formatters) | Display formatting helpers |
| [Friendly errors](/en-US/docs/modules/friendly-errors) | YAML + Zod error reporting |

## Import paths

cli-engine uses subpath exports. Import modules via their subpath:

```typescript
import { FileSystem, EngineContext } from '@grekt-labs/cli-engine/core'
import { CATEGORIES, CATEGORY_CONFIG } from '@grekt-labs/cli-engine/categories'
import { ArtifactManifestSchema } from '@grekt-labs/cli-engine/schemas'
import { scanArtifact } from '@grekt-labs/cli-engine/artifact'
import { parseSource, createRegistryClient } from '@grekt-labs/cli-engine/registry'
import { formatBytes, estimateTokens } from '@grekt-labs/cli-engine/formatters'
import { safeParseYaml } from '@grekt-labs/cli-engine/friendly-errors'
```
