# Testing

cli-engine provides mock implementations for all core interfaces, making it straightforward to test code that depends on the engine.

## Mock factories

All mocks are available from the main export:

```typescript
import {
  createMockFileSystem,
  createMockHttpClient,
  createMockShellExecutor,
  createMockTokenProvider
} from '@grekt-labs/cli-engine'
```

### createMockFileSystem

```typescript
function createMockFileSystem(
  initialFiles?: Record<string, string | Buffer>
): FileSystem
```

Creates an in-memory file system pre-populated with the given files:

```typescript
const fs = createMockFileSystem({
  '/project/grekt.yaml': 'name: "@myorg/my-artifact"\nversion: 1.0.0\ndescription: Test',
  '/project/.grekt/agents/helper.md': '---\ngrk-type: agents\ngrk-name: helper\n---\nContent'
})

fs.readFile('/project/grekt.yaml') // returns the YAML string
fs.exists('/project/grekt.yaml')   // true
fs.exists('/nonexistent')          // false
```

### createMockHttpClient

```typescript
function createMockHttpClient(
  responses?: Map<string, Response>
): HttpClient
```

Creates a mock HTTP client with pre-configured responses:

```typescript
const http = createMockHttpClient(new Map([
  ['https://registry.grekt.com/artifact?id=@myorg/tool', jsonResponse({ name: '@myorg/tool' })],
  ['https://example.com/artifact.tar.gz', binaryResponse(tarballBuffer)]
]))
```

### createMockShellExecutor

```typescript
function createMockShellExecutor(
  results?: Record<string, string | Error>
): ShellExecutor
```

Creates a mock shell executor with pre-configured command results:

```typescript
const shell = createMockShellExecutor({
  'tar': 'extracted successfully',
  'oras': new Error('command not found')
})
```

### createMockTokenProvider

```typescript
function createMockTokenProvider(tokens?: {
  registry?: Record<string, string>
  git?: { github?: string; gitlab?: string }
}): TokenProvider
```

Creates a mock token provider:

```typescript
const tokens = createMockTokenProvider({
  registry: { '@myorg': 'registry-token-123' },
  git: { github: 'ghp_abc123' }
})
```

## Response helpers

Utility functions for creating mock `Response` objects:

```typescript
function jsonResponse(data: unknown, status?: number): Response
function errorResponse(status: number, statusText: string): Response
function binaryResponse(data: Buffer | Uint8Array, status?: number): Response
```

## Testing patterns

### Testing artifact scanning

```typescript
import { scanArtifact, createMockFileSystem } from '@grekt-labs/cli-engine'

const fs = createMockFileSystem({
  '/artifact/grekt.yaml': 'name: "@test/artifact"\nversion: 1.0.0\ndescription: Test artifact',
  '/artifact/agents/helper.md': '---\ngrk-type: agents\ngrk-name: helper\ngrk-description: A helper agent\n---\nYou are a helper.'
})

const result = scanArtifact(fs, '/artifact')
expect(result).not.toBeNull()
expect(result.manifest.name).toBe('@test/artifact')
```

### Testing config parsing

```typescript
import { safeParseYaml, ProjectConfigSchema } from '@grekt-labs/cli-engine'

const result = safeParseYaml('targets: [claude]', ProjectConfigSchema, 'grekt.yaml')

if (result.success) {
  expect(result.data.targets).toEqual(['claude'])
}
```

### Testing version operations

```typescript
import { bumpVersion, compareSemver, sortVersionsDesc } from '@grekt-labs/cli-engine'

expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0')
expect(compareSemver('2.0.0', '1.9.9')).toBe(1)
expect(sortVersionsDesc(['1.0.0', '2.0.0', '1.5.0'])).toEqual(['2.0.0', '1.5.0', '1.0.0'])
```
