# EngineContext

`EngineContext` bundles all injected dependencies into a single object. It's the primary way to pass dependencies through the engine.

## Definition

```typescript
interface EngineContext {
  fs: FileSystem
  http: HttpClient
  shell: ShellExecutor
  tokens: TokenProvider
  paths: PathConfig
}
```

## PathConfig

Defines the filesystem paths for a grekt project:

```typescript
interface PathConfig {
  projectRoot: string
  artifactsDir: string
  configFile: string
  lockFile: string
  localConfigFile: string
}
```

| Field | Description | Typical value |
|-------|-------------|---------------|
| `projectRoot` | Root directory of the project | `/home/user/my-project` |
| `artifactsDir` | Directory where artifacts are stored | `{projectRoot}/.grekt` |
| `configFile` | Path to the project config file | `{projectRoot}/grekt.yaml` |
| `lockFile` | Path to the lockfile | `{projectRoot}/grekt.lock` |
| `localConfigFile` | Path to local (gitignored) config | `{projectRoot}/grekt.local.yaml` |

## Usage pattern

Most engine functions accept individual interfaces rather than the full context. This keeps function signatures focused:

```typescript
// Functions take only what they need
scanArtifact(fs: FileSystem, artifactDir: string)
downloadAndExtractTarball(http: HttpClient, fs: FileSystem, shell: ShellExecutor, ...)
getLockfile(fs: FileSystem, lockfilePath: string)
```

The `EngineContext` is primarily used at the integration layer to organize dependencies:

```typescript
const context: EngineContext = {
  fs: createNodeFileSystem(),
  http: { fetch: globalThis.fetch },
  shell: createNodeShellExecutor(),
  tokens: createEnvTokenProvider(),
  paths: resolveProjectPaths(cwd)
}

// Then destructure as needed
const artifact = scanArtifact(context.fs, context.paths.artifactsDir)
const lockfile = getLockfile(context.fs, context.paths.lockFile)
```
