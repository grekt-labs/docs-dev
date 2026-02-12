# Extending cli-engine

This guide covers how to add new modules and contribute to cli-engine.

## Adding a new category

Categories are defined in a single place. To add a new component type:

1. Add the category name to the `CATEGORIES` array in `src/categories/categories.ts`
2. Add its configuration to `CATEGORY_CONFIG`

```typescript
const CATEGORIES = ["agents", "skills", "commands", "mcps", "rules", "hooks", "mytype"] as const

const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  // ... existing categories
  mytype: {
    singular: "mytype",
    defaultPath: "mytypes",
    allowedFormats: ["md"]  // or ["json"]
  }
}
```

Because the `Category` type is inferred from the array, TypeScript will enforce that all code handling categories also handles the new one.

## Adding a new registry client

1. Implement the `RegistryClient` interface in `src/registry/clients/`
2. Add a new registry type to the `RegistryEntry` schema
3. Add a case in `src/registry/factory.ts` to create your client

```typescript
// src/registry/clients/my-registry.ts
export class MyRegistryClient implements RegistryClient {
  constructor(
    private registry: ResolvedRegistry,
    private http: HttpClient,
    private fs: FileSystem,
    private shell: ShellExecutor
  ) {}

  async download(artifactId: string, options: ArtifactDownloadOptions): Promise<DownloadResult> {
    // Implement download logic
  }

  async publish(options: ArtifactPublishOptions): Promise<PublishResult> {
    // Implement publish logic
  }

  // ... implement remaining methods
}
```

## Adding a new sync plugin

Sync plugins are implemented in the CLI layer (not in cli-engine), but they use the `SyncPlugin` interface from cli-engine:

1. Implement the `SyncPlugin` interface
2. Register the plugin in the CLI's plugin system

See [Sync](/en-US/docs/modules/sync) for the interface definition.

## Module conventions

When adding a new module to cli-engine:

- **No I/O** - accept `FileSystem`, `HttpClient`, etc. as parameters
- **Pure functions** - prefer stateless functions over classes
- **Result types** - use `ParseResult<T>` for operations that can fail
- **Zod schemas** - define schemas first, infer types from them
- **Separate type files** - put types in `*.types.ts` files
- **Test with mocks** - use the test utilities from `src/test-utils/`

### File structure

```
src/
└── myModule/
    ├── index.ts          # Public API exports
    ├── myModule.ts       # Implementation
    ├── myModule.types.ts # Type definitions
    └── myModule.test.ts  # Tests
```

### Export from index

Add your module's public API to `src/index.ts` with a subpath export:

```typescript
// In package.json exports
"#/myModule": "./src/myModule/index.ts"
```
