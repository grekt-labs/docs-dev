# Artifact index

The artifact index module generates and manages the index file used for lazy-loaded artifacts. AI tools read this index to discover available artifacts without loading all their content upfront.

## How it works

Artifacts in **lazy** mode are not copied directly into the AI tool's context. Instead, they are listed in an index file with their keywords. When the AI tool receives a user request, it checks the index to find relevant artifacts and loads them on demand.

## generateIndex

```typescript
function generateIndex(artifacts: IndexGeneratorInput[]): ArtifactIndex
```

Builds an `ArtifactIndex` from a list of artifact inputs. Only artifacts with `mode: "lazy"` are included. Core artifacts live directly in the AI context.

```typescript
interface IndexGeneratorInput {
  artifactId: string
  keywords: string[]
  mode: ArtifactMode          // "core" or "lazy"
  components: CategoryFilePaths   // Record<Category, string[]>
}
```

## serializeIndex

```typescript
function serializeIndex(index: ArtifactIndex, options?: SerializeIndexOptions): string
```

Serializes an `ArtifactIndex` into a minified text format designed for AI tool consumption:

```
<grekt-untrusted-context>
<instructions>On every new user request, check this index...</instructions>
<terminology>Match keywords below...</terminology>
@scope/artifact:keyword1,keyword2
@scope/other:keyword3
</grekt-untrusted-context>
```

The format is intentionally compact to minimize token usage in the AI tool's context window.

## parseIndex

```typescript
function parseIndex(content: string): ArtifactIndex
```

Parses a serialized index back into an `ArtifactIndex` object.

## Usage example

```typescript
import { generateIndex, serializeIndex } from '@grekt-labs/cli-engine/artifactIndex'

const index = generateIndex([
  {
    artifactId: "@grekt/analyzer",
    keywords: ["analyze", "code", "review"],
    mode: "lazy",
    components: {
      agents: ["analyzer-agent.md"],
      skills: ["deep-review.md"],
      commands: [],
      mcps: [],
      rules: [],
      hooks: []
    }
  }
])

const serialized = serializeIndex(index)
// Write to .grekt/index or equivalent
```
