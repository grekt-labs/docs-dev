# Version

Pure semver utilities. No external dependencies, all parsing and comparison is implemented natively.

## Validation

### isValidSemver

```typescript
function isValidSemver(version: string): boolean
```

Validates a semver string. Rejects `v`-prefixed versions (`v1.0.0` is invalid).

Accepts: `1.0.0`, `1.2.3-beta.1`, `0.0.1-alpha.0+build.123`

## Bumping

### bumpVersion

```typescript
function bumpVersion(currentVersion: string, type: BumpType): string
```

Bumps a version by the specified type:

```typescript
type BumpType = "patch" | "minor" | "major"

bumpVersion("1.2.3", "patch") // "1.2.4"
bumpVersion("1.2.3", "minor") // "1.3.0"
bumpVersion("1.2.3", "major") // "2.0.0"
```

### bumpPrerelease

```typescript
function bumpPrerelease(currentVersion: string, identifier: string): string
```

Creates or bumps a prerelease version:

```typescript
bumpPrerelease("1.0.0", "beta")       // "1.0.1-beta.0"
bumpPrerelease("1.0.1-beta.0", "beta") // "1.0.1-beta.1"
```

## Comparison

### compareSemver

```typescript
function compareSemver(a: string, b: string): -1 | 0 | 1
```

Compares two semver strings. Returns `-1` if `a < b`, `0` if equal, `1` if `a > b`.

### isGreaterThan / isLessThan

```typescript
function isGreaterThan(a: string, b: string): boolean
function isLessThan(a: string, b: string): boolean
```

### sortVersionsDesc

```typescript
function sortVersionsDesc(versions: string[]): string[]
```

Sorts an array of version strings in descending order (newest first).

### getHighestVersion

```typescript
function getHighestVersion(versions: string[]): string | null
```

Returns the highest version from an array, or `null` if the array is empty.
