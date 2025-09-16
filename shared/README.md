# Shared Types

This folder contains TypeScript type definitions shared between the client and server.

## Usage

Import types from anywhere in the project using the `@shared` path alias:

```typescript
// From client or server code
import type { Station, BoardEntry, BoardResponse } from "@shared/types";
```

The path alias is configured in:

- Root `tsconfig.json` for server-side code
- Client `tsconfig.app.json` for client-side code
- Client `vite.config.ts` for build-time resolution
