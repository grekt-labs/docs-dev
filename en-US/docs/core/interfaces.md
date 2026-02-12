# Interfaces

cli-engine defines four core interfaces for dependency injection. You must provide implementations for all of them to use the engine.

## FileSystem

Abstracts all file system operations.

```typescript
interface FileSystem {
  readFile(path: string): string
  readFileBinary(path: string): Buffer
  writeFile(path: string, content: string): void
  writeFileBinary(path: string, content: Buffer): void
  exists(path: string): boolean
  mkdir(path: string, options?: { recursive?: boolean }): void
  readdir(path: string): string[]
  stat(path: string): { isDirectory: boolean; isFile: boolean; size: number }
  unlink(path: string): void
  rmdir(path: string, options?: { recursive?: boolean }): void
  copyFile(src: string, dest: string): void
  rename(src: string, dest: string): void
}
```

### Implementation notes

- `readFile` must return UTF-8 text
- `readFileBinary` must return raw bytes as a `Buffer`
- `mkdir` with `{ recursive: true }` must create parent directories
- `stat` must return at minimum `isDirectory`, `isFile`, and `size`
- `rmdir` with `{ recursive: true }` must remove directory trees

## HttpClient

Abstracts HTTP requests. Follows the standard `fetch` API signature.

```typescript
interface HttpClient {
  fetch(url: string, options?: RequestInit): Promise<Response>
}
```

### Implementation notes

- Must return standard `Response` objects
- Used for registry API calls, tarball downloads, and OCI operations
- The response must support `.json()`, `.text()`, `.arrayBuffer()`, and `.blob()` methods

## ShellExecutor

Abstracts command execution. Uses array-based arguments for security.

```typescript
interface ShellExecutor {
  execFile(command: string, args: string[]): string
}
```

### Implementation notes

- **Arguments must be passed as an array**, not concatenated into a string. This prevents shell injection attacks.
- Must return stdout as a string
- Must throw on non-zero exit codes
- Used for tarball extraction (`tar`), OCI push operations (`oras`), and git operations

```typescript
// Correct
shell.execFile('tar', ['-xzf', tarballPath, '-C', targetDir])

// Wrong - would allow injection
shell.exec(`tar -xzf ${tarballPath} -C ${targetDir}`)
```

## TokenProvider

Abstracts credential retrieval for registries and git hosts.

```typescript
interface TokenProvider {
  getRegistryToken(scope: string): string | undefined
  getGitToken(type: 'github' | 'gitlab', host?: string): string | undefined
}
```

### Implementation notes

- `getRegistryToken` receives a scope like `@myorg` and should return the token for that scope's registry
- `getGitToken` receives the host type and optional hostname
- Returning `undefined` means no token is available (anonymous access)
