# Formatters

Pure display formatting utilities with no dependencies.

## formatBytes

```typescript
function formatBytes(bytes: number): string
```

Formats a byte count into a human-readable string:

```typescript
formatBytes(0)       // "0 B"
formatBytes(1024)    // "1.0 KB"
formatBytes(1536)    // "1.5 KB"
formatBytes(1048576) // "1.0 MB"
```

## estimateTokens

```typescript
function estimateTokens(bytes: number): number
```

Estimates the token count for a given byte size using the ~4 characters per token heuristic.

## formatNumber

```typescript
function formatNumber(num: number): string
```

Formats a number with thousands separators:

```typescript
formatNumber(1234567) // "1,234,567"
```

## formatTokenEstimate

```typescript
function formatTokenEstimate(bytes: number): string
```

Combines `estimateTokens` and `formatNumber` into a display string:

```typescript
formatTokenEstimate(6000) // "~1,500 tokens"
```
