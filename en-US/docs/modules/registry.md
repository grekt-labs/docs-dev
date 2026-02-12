# Registry

The registry module handles source parsing, registry resolution, client creation, and artifact download/publish operations.

## Source parsing

### parseSource

```typescript
function parseSource(source: string): ParsedSource
```

Parses an artifact source string into a structured object. Supports three formats:

| Format | Example | Registry type |
|--------|---------|--------------|
| Registry | `@author/name` or `name` | `default` |
| GitHub | `github:owner/repo` or `github:owner/repo#v1.0.0` | `github` |
| GitLab | `gitlab:owner/repo` or `gitlab:host.com/owner/repo` | `gitlab` |

### getSourceDisplayName

```typescript
function getSourceDisplayName(source: ParsedSource): string
```

Returns a human-readable display name for a parsed source.

## Registry resolver

### resolveRegistry

```typescript
function resolveRegistry(
  scope: string,
  localConfig: LocalConfig | null,
  tokens?: TokenProvider
): ResolvedRegistry
```

Resolves a scope (e.g., `@myorg`) to a fully resolved registry configuration. Checks local config for custom registry entries, applies defaults, and injects tokens.

### resolveRegistryForArtifact

```typescript
function resolveRegistryForArtifact(
  artifactSource: string,
  localConfig: LocalConfig | null,
  tokens?: TokenProvider
): { registry: ResolvedRegistry; artifactId: string; version?: string }
```

Convenience function that parses a source string and resolves its registry in one step.

### parseArtifactId

```typescript
function parseArtifactId(source: string): {
  scope: string
  name: string
  version?: string
  artifactId: string
}
```

Parses `@scope/name@version` format into components.

## ResolvedRegistry

```typescript
interface ResolvedRegistry {
  type: "gitlab" | "github" | "default"
  host: string
  project?: string
  token?: string
  prefix?: string
  apiBasePath?: string    // For default registry
}
```

## Registry clients

### RegistryClient interface

All registry clients implement this interface:

```typescript
interface RegistryClient {
  download(artifactId: string, options: ArtifactDownloadOptions): Promise<DownloadResult>
  publish(options: ArtifactPublishOptions): Promise<PublishResult>
  getLatestVersion(artifactId: string): Promise<string | null>
  versionExists(artifactId: string, version: string): Promise<boolean>
  listVersions(artifactId: string): Promise<string[]>
  getArtifactInfo?(artifactId: string): Promise<RegistryArtifactInfo | null>
}
```

### DownloadResult

```typescript
interface DownloadResult {
  success: boolean
  version?: string
  resolved?: string          // Stable URL for lockfile
  deprecationMessage?: string
  integrity?: string
  fileHashes?: Record<string, string>
  error?: string
}
```

### Client types

| Client | Registry | Transport |
|--------|----------|-----------|
| `DefaultRegistryClient` | registry.grekt.com | REST API (Edge Functions) |
| `GitHubRegistryClient` | GitHub Container Registry | OCI Distribution Spec |
| `GitLabRegistryClient` | GitLab Generic Packages | GitLab Package API |

### Factory

```typescript
function createRegistryClient(
  registry: ResolvedRegistry,
  http: HttpClient,
  fs: FileSystem,
  shell: ShellExecutor
): RegistryClient
```

Creates the appropriate client based on the resolved registry type. This is the single decision point for client instantiation.

## Download utilities

### downloadAndExtractTarball

```typescript
async function downloadAndExtractTarball(
  http: HttpClient,
  fs: FileSystem,
  shell: ShellExecutor,
  url: string,
  targetDir: string,
  options?: DownloadOptions
): Promise<TarballDownloadResult>
```

Downloads a tarball from a URL and extracts it to a target directory. Includes pre-extraction security validation (path traversal, symlinks).

### URL builders

```typescript
function buildGitHubTarballUrl(owner: string, repo: string, ref?: string): string
function buildGitLabArchiveUrl(host: string, projectPath: string, ref?: string): string
```

### Header builders

```typescript
function getGitHubHeaders(token?: string): Record<string, string>
function getGitLabHeaders(token?: string): Record<string, string>
```
