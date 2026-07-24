# Sekeh Frontend

The Sekeh web client is a React 19, TypeScript, Vite, and Tailwind CSS application.
Its source is organized by product feature so each module owns its API, pages,
components, hooks, and state.

## Source structure

```text
src/
├── app/
│   ├── providers/       # Application-level providers
│   ├── router/          # Route definitions and code splitting
│   └── styles/          # Global styles and design tokens
├── features/
│   ├── admin/
│   ├── auth/
│   ├── chat/
│   ├── contact/
│   ├── landing/
│   ├── marks/
│   ├── profile/
│   └── resume/
├── shared/
│   ├── api/             # HTTP client and cross-feature API types
│   ├── components/
│   │   ├── feedback/    # Toasts and loading states
│   │   ├── jobs/        # Reused domain presentation
│   │   ├── layout/      # Application shells and navigation
│   │   └── ui/          # Shadcn-style UI primitives
│   ├── hooks/           # Cross-feature hooks
│   └── lib/             # Framework-independent helpers
└── main.tsx
```

## Conventions

- React components and their files use PascalCase.
- Hooks use the `useX` naming pattern.
- Feature-only code remains inside its feature module.
- Code moves to `shared` only when more than one feature consumes it.
- Imports use the `@/` alias instead of fragile parent-directory paths.
- Pages use the `Page` suffix and dialogs use the `Dialog` suffix.
- UI primitives preserve the existing Sekeh colors, type, spacing, RTL layout,
  focus styles, and responsive behavior.

## UI layer

The components under `src/shared/components/ui` follow the Shadcn approach:
small, accessible primitives live in the repository and remain fully editable.
They use the existing Tailwind design tokens rather than a separate theme.

All feature dialogs render through the shared `Dialog` primitive. It supports
keyboard dismissal, focus-visible states, backdrop dismissal, controlled and
uncontrolled usage, mobile bottom-sheet behavior, and full-screen mobile forms.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm test
```

Environment values are read from the existing `.env`, `.env.development`, and
`.env.production` files.
