# Getting started

## Installation

```bash
bun add @grekt-labs/cli-engine
```

Or with npm/pnpm:

```bash
npm install @grekt-labs/cli-engine
pnpm add @grekt-labs/cli-engine
```

## Basic usage

cli-engine requires you to provide implementations for its core interfaces. Here's a minimal example:

```typescript
import type { EngineContext } from '@grekt-labs/cli-engine/core'
import { scanArtifact } from '@grekt-labs/cli-engine/artifact'

// 1. Create your interface implementations
const fs: FileSystem = {
  readFile: (path) => Bun.file(path).text(),
  writeFile: (path, content) => Bun.write(path, content),
  exists: (path) => existsSync(path),
  // ... implement all FileSystem methods
}

const http: HttpClient = {
  fetch: (url, options) => globalThis.fetch(url, options)
}

const shell: ShellExecutor = {
  execFile: (command, args) => {
    const result = spawnSync([command, ...args])
    return result.stdout.toString()
  }
}

const tokens: TokenProvider = {
  getRegistryToken: (scope) => process.env.GREKT_TOKEN,
  getGitToken: (type) => process.env.GITHUB_TOKEN
}

// 2. Create the engine context
const context: EngineContext = {
  fs,
  http,
  shell,
  tokens,
  paths: {
    projectRoot: '/path/to/project',
    artifactsDir: '/path/to/project/.grekt',
    configFile: '/path/to/project/grekt.yaml',
    lockFile: '/path/to/project/grekt.lock',
    localConfigFile: '/path/to/project/grekt.local.yaml'
  }
}

// 3. Use engine functions
const artifact = scanArtifact(context.fs, '/path/to/artifact')
```

## For testing

cli-engine provides mock implementations for all interfaces:

```typescript
import {
  createMockFileSystem,
  createMockHttpClient,
  createMockShellExecutor,
  createMockTokenProvider
} from '@grekt-labs/cli-engine/test-utils'

const fs = createMockFileSystem({
  '/project/grekt.yaml': 'name: my-artifact\nversion: 1.0.0'
})

const http = createMockHttpClient()
const shell = createMockShellExecutor()
const tokens = createMockTokenProvider()
```

See [Testing](/en-US/docs/advanced/testing) for more details.
