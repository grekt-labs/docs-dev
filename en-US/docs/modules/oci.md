# OCI

The OCI module implements a client for the OCI Distribution Specification, used for interacting with GitHub Container Registry (GHCR).

## Media types

```typescript
const GREKT_MEDIA_TYPES = {
  manifest: "application/vnd.oci.image.manifest.v1+json",
  config: "application/vnd.grekt.artifact.config.v1+json",
  layer: "application/vnd.grekt.artifact.layer.v1.tar+gzip",
} as const
```

## OCI types

### OciDescriptor

```typescript
interface OciDescriptor {
  mediaType: string
  digest: string          // e.g., sha256:abc123...
  size: number
  annotations?: Record<string, string>
}
```

### OciManifest

```typescript
interface OciManifest {
  schemaVersion: 2
  mediaType: string
  config: OciDescriptor
  layers: OciDescriptor[]
  annotations?: Record<string, string>
}
```

## OciClient

```typescript
class OciClient {
  constructor(config: OciRegistryConfig, http: HttpClient)

  async ping(): Promise<boolean>
  async pullManifest(name: string, reference: string): Promise<PullManifestResult>
  async pullBlob(name: string, digest: string): Promise<PullBlobResult>
  async listTags(name: string): Promise<ListTagsResult>
  async tagExists(name: string, tag: string): Promise<boolean>
  async pullArtifactLayer(name: string, tag: string): Promise<PullBlobResult>
}
```

### Methods

| Method | Description |
|--------|-------------|
| `ping` | Check if the registry is accessible |
| `pullManifest` | Retrieve an OCI manifest by name and reference (tag or digest) |
| `pullBlob` | Download a blob by its digest |
| `listTags` | List all tags for a repository |
| `tagExists` | Check if a specific tag exists |
| `pullArtifactLayer` | Convenience method that pulls the manifest and then downloads the artifact layer |

The `OciClient` is used internally by `GitHubRegistryClient` for pull operations. Push operations use the `oras` CLI tool via `ShellExecutor`.
