# Artifact

The artifact module handles scanning, parsing, naming, integrity verification, and lockfile management for grekt artifacts.

## Scanner

### scanArtifact

```typescript
function scanArtifact(fs: FileSystem, artifactDir: string): ArtifactInfo | null
```

Scans a directory and returns structured information about the artifact it contains. Returns `null` if the directory is not a valid artifact.

The returned `ArtifactInfo` includes the manifest, all discovered components organized by category, and any invalid files found.

### generateComponents

```typescript
function generateComponents(info: ArtifactInfo): Components
```

Auto-generates the `components` section from scanned files. Used during publish/pack to populate the manifest.

## Frontmatter

### parseFrontmatter

```typescript
function parseFrontmatter(content: string): FrontmatterParseResult
```

Parses YAML frontmatter from markdown artifact files:

```typescript
type FrontmatterParseResult =
  | { success: true; parsed: ParsedArtifact }
  | { success: false; reason: InvalidFileReason }
```

The frontmatter must contain `grk-type`, `grk-name`, and `grk-description` fields.

## Naming

Utilities for artifact ID parsing and safe filename generation.

### parseName

```typescript
function parseName(name: string): {
  scope: string | null
  baseName: string
  artifactId: string
}
```

Parses an artifact name into its components. Handles both scoped (`@org/name`) and unscoped (`name`) formats.

### isScoped

```typescript
function isScoped(name: string): boolean
```

Checks if a name uses the `@scope/name` format.

### getSafeFilename

```typescript
function getSafeFilename(artifactId: string, filepath: string): string
```

Generates a filesystem-safe filename from an artifact ID and component path. For example, `getSafeFilename("@grekt/analyzer", "analyze.md")` returns `"grekt-analyzer_analyze.md"`.

### toSafeName

```typescript
function toSafeName(artifactId: string): string
```

Converts an artifact ID to a safe directory name. `toSafeName("@grekt/analyzer")` returns `"grekt-analyzer"`.

### buildArtifactId

```typescript
function buildArtifactId(scope: string, name: string): string
```

Builds a full artifact ID from scope and name.

### getArtifactIdFromManifest

```typescript
function getArtifactIdFromManifest(manifest: ArtifactManifest): string
```

Extracts the artifact ID from a manifest object.

## Integrity

SHA256-based integrity verification for artifacts.

### hashDirectory

```typescript
function hashDirectory(
  fs: FileSystem,
  dir: string
): Record<string, string>
```

Returns a map of relative file paths to their SHA256 hashes.

### calculateIntegrity

```typescript
function calculateIntegrity(fileHashes: Record<string, string>): string
```

Calculates a single integrity hash from a map of file hashes. The file hashes are sorted before hashing to ensure determinism.

### verifyIntegrity

```typescript
function verifyIntegrity(
  fs: FileSystem,
  artifactDir: string,
  expectedFiles: Record<string, string>
): IntegrityResult
```

Verifies that an artifact directory matches expected hashes:

```typescript
interface IntegrityResult {
  valid: boolean
  missingFiles: string[]
  modifiedFiles: string[]
  extraFiles: string[]
}
```

### getDirectorySize

```typescript
function getDirectorySize(fs: FileSystem, dir: string): number
```

Calculates the total size in bytes of all files in a directory.

## Lockfile

### getLockfile

```typescript
function getLockfile(fs: FileSystem, lockfilePath: string): ParseResult<Lockfile>
```

Reads and parses a lockfile. Returns a `ParseResult` with friendly error messages if parsing fails.

### saveLockfile

```typescript
function saveLockfile(fs: FileSystem, lockfilePath: string, data: Lockfile): void
```

Writes a lockfile to disk.

### createEmptyLockfile

```typescript
function createEmptyLockfile(): Lockfile
```

Creates a new empty lockfile with `version: 1`.

### lockfileExists

```typescript
function lockfileExists(fs: FileSystem, lockfilePath: string): boolean
```

Checks if a lockfile exists at the given path.
