# Sync

The sync module defines the plugin interface for syncing artifacts to AI tool targets (Claude, Cursor, etc.) and provides shared constants.

## SyncPlugin interface

```typescript
interface SyncPlugin {
  id: string              // e.g., "claude", "cursor"
  name: string            // Display name
  targetFile: string      // e.g., ".claude", ".cursorrules"

  targetExists(projectRoot: string): boolean
  sync(lockfile: Lockfile, projectRoot: string, options: SyncOptions): Promise<SyncResult>
  preview(lockfile: Lockfile, projectRoot: string, options?: SyncOptions): SyncPreview
  getSyncPaths(): Record<Category, string> | null
  getTargetPaths(): TargetPaths | null
  setup?(projectRoot: string): void
}
```

### SyncResult

```typescript
interface SyncResult {
  created: string[]
  updated: string[]
  skipped: string[]
}
```

### SyncOptions

```typescript
interface SyncOptions {
  dryRun?: boolean
  force?: boolean
  createTarget?: boolean
  projectConfig?: ProjectConfig   // For mode filtering
}
```

## Constants

The sync module exports constants used for artifact content injection:

```typescript
const GREKT_UNTRUSTED_TAG = "grekt-untrusted-context"
const GREKT_UNTRUSTED_START = `<${GREKT_UNTRUSTED_TAG}>`
const GREKT_UNTRUSTED_END = `</${GREKT_UNTRUSTED_TAG}>`
const GREKT_SECTION_HEADER = "**MANDATORY:**"
const GREKT_ENTRY_POINT_TEXT = "**MANDATORY:** Read `.grekt/index` at session start..."
```

These constants ensure consistent formatting across all sync plugins. The untrusted context tags wrap artifact content to signal to AI tools that the content comes from external sources.

## Implementing a SyncPlugin

To add support for a new AI tool target:

1. Implement the `SyncPlugin` interface
2. Define the target file path and directory structure
3. Handle reading artifacts from the lockfile locations
4. Write component files to the target's expected paths
5. Generate the artifact index for lazy-loaded components

```typescript
const myPlugin: SyncPlugin = {
  id: "my-tool",
  name: "My AI Tool",
  targetFile: ".my-tool",

  targetExists(projectRoot) {
    // Check if the target tool's config directory exists
  },

  async sync(lockfile, projectRoot, options) {
    // Read artifacts, write to target paths
    return { created: [], updated: [], skipped: [] }
  },

  preview(lockfile, projectRoot, options) {
    // Return what would change without writing
  },

  getSyncPaths() {
    // Return category → path mapping
  },

  getTargetPaths() {
    // Return resolved target paths
  }
}
```
