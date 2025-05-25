# Frontend Project

A modern web application built with React 19, using Next.js 15 as the framework and Tailwind CSS for styling.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [UI Components](#ui-components)
- [Styling and Theming](#styling-and-theming)
- [Component Usage Examples](#component-usage-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Overview

This frontend project uses React 19 as the core UI library, enhanced by the Next.js 15 framework which provides additional features like routing, server-side rendering, and optimized builds. The UI is styled using Tailwind CSS for a responsive and customizable design system.

The project features a comprehensive UI component library based on Radix UI primitives, all styled consistently with Tailwind CSS and offering full accessibility support. The components are designed to work together seamlessly to create a cohesive user experience.

### Project Architecture

The project has a dual structure:

1. **Next.js Structure** (`/app` directory): Uses the modern App Router pattern from Next.js 15 for server components, layouts, and routing.

2. **React Structure** (`/src` directory): Contains the traditional React application setup with components, contexts, and pages.

This hybrid approach allows the project to leverage both the enhanced features of Next.js (like server-side rendering and optimized routing) while maintaining compatibility with traditional React patterns and components.

## Project Structure

```
frontend/
├── .next/                  # Next.js build output (generated)
├── app/                    # Next.js app directory (App Router)
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout (persistent across pages)
│   └── page.tsx            # Home page component
├── src/                    # Source directory (React application)
│   ├── App.tsx             # Main React App component
│   ├── AppWrapper.tsx      # App wrapper component
│   ├── ClientApp.tsx       # Client-side application entry
│   ├── index.tsx           # Application entry point
│   ├── index.css           # Base CSS styles
│   ├── styles.css          # Additional CSS styles
│   ├── tailwind.config.js  # Tailwind configuration for src
│   ├── components/         # React components specific to src
│   ├── pages/              # Page components
│   ├── contexts/           # React context providers
│   └── types/              # TypeScript type definitions
├── components/             # Reusable React components
│   ├── theme-provider.tsx  # Theme provider for light/dark mode
│   └── ui/                 # UI component library (45+ components)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and shared code
│   └── utils.ts            # Helper utility functions
├── public/                 # Static assets (images, fonts, etc.)
├── styles/                 # Additional styles
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Technology Stack

- **Core UI Library**: [React 19](https://react.dev/) - The latest version of React with improved performance and features
- **Framework**: [Next.js 15](https://nextjs.org/) - Enhances React with routing, SSR, and optimized builds
- **Language**: [TypeScript](https://www.typescriptlang.org/) - For type safety and better developer experience
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Component Primitives**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible component primitives
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) - Performant form state management
- **Form Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Data Fetching**: [React Query](https://tanstack.com/query/latest) - Data synchronization for React
- **Charting**: [Recharts](https://recharts.org/) - Composable charting library
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- **Date Management**: [date-fns](https://date-fns.org/) - Modern JavaScript date utility library
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) - Toast notifications for React
- **Animations**: [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) - Tailwind plugin for animations

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm, yarn, or pnpm

### Installation

```bash
# Navigate to the frontend directory
cd core/frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

The project uses Next.js, which may require environment variables for certain features. Create a `.env.local` file in the root directory if needed:

```
# Example environment variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Available Scripts

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Build for production
npm run build
# or
yarn build
# or
pnpm build

# Start production server
npm run start
# or
yarn start
# or
pnpm start

# Run linting
npm run lint
# or
yarn lint
# or
pnpm lint
```

The development server will start on [http://localhost:3000](http://localhost:3000).

### Running the Application

Depending on how you want to run the application, you have two options:

1. **Next.js Application**: Using `npm run dev` will start the Next.js server, serving the application from the `/app` directory structure.

2. **React Application**: If you need to run the traditional React application from the `/src` directory, you may need to specify an alternative entry point. Check the package.json scripts for any custom commands related to running the React version of the application.

The dual structure may be part of a migration strategy from a traditional React app to Next.js, or designed to support different build targets (client-only vs. server-rendered).

## UI Components

The project includes a comprehensive set of UI components based on Radix UI primitives. These components are located in the `components/ui/` directory and include:

- **Layout Components**: Accordion, AspectRatio, Collapsible, Resizable panels, ScrollArea, Separator, etc.
- **Input Components**: Button, Checkbox, Input, InputOTP, RadioGroup, Select, Slider, Switch, Textarea, etc.
- **Data Display**: Avatar, Badge, Calendar, Card, Table
- **Feedback Components**: Alert, Progress, Skeleton, Toast
- **Overlay Components**: AlertDialog, Dialog, Drawer, DropdownMenu, HoverCard, Popover, Tooltip
- **Navigation**: Breadcrumb, NavigationMenu, Pagination, Sidebar, Tabs
- **Data Visualization**: Chart

All components are:
- Fully accessible following ARIA standards
- Styled with Tailwind CSS
- Customizable through variants and props
- Responsive for all screen sizes
- Compatible with both light and dark modes

## Styling and Theming

### Tailwind Configuration

The project uses Tailwind CSS for styling with a custom configuration defined in `tailwind.config.ts`. The theme includes:

- Custom color palette with semantic color variables
- Light and dark mode support via the `theme-provider.tsx` component
- Responsive design utilities
- Animation utilities
- Custom border radius values

### Theme System

The theming system uses CSS variables defined in `globals.css` and is managed through the `next-themes` package. The theme can be toggled between light and dark modes:

```tsx
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
};
```

### Global Styles

Global styles are defined in `app/globals.css` and include:

- CSS variables for the color palette
- Base styles for HTML elements
- Utility classes

## Component Usage Examples

### Basic Button Usage

```tsx
import { Button } from "@/components/ui/button";

export default function MyComponent() {
  return (
    <Button variant="default" size="default" onClick={() => alert("Clicked!")}>
      Click Me
    </Button>
  );
}
```

### Form With Validation

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Configuration

### Next.js

The Next.js configuration is in `next.config.mjs` and includes:

- ESLint and TypeScript build error handling (errors are ignored during builds)
- Image optimization settings
- Any environment variable handling

### TypeScript

TypeScript configuration is in `tsconfig.json` with settings optimized for Next.js and React development. The configuration includes:

- Strict type checking
- Module resolution settings
- Path aliases (e.g., `@/components/*`)
- JSX runtime configuration

### Tailwind CSS

Tailwind CSS is configured in `tailwind.config.ts` with custom theme extensions and plugins. The configuration includes:

- Content paths for files that should be processed
- Theme extensions for colors, animations, etc.
- Plugins for additional utilities

## Troubleshooting

### Common Issues

**Issue**: Components not rendering or styling incorrectly
**Solution**: Ensure you've imported the component from the correct path and are using the correct props. Check the Tailwind class names for any typos.

**Issue**: Next.js build failing
**Solution**: The project is configured to ignore TypeScript and ESLint errors during builds. If you need to fix these issues, run `npm run lint` to see all linting errors.

**Issue**: Dark mode not working
**Solution**: Make sure your component is wrapped in the `ThemeProvider` from `components/theme-provider.tsx`.

**Issue**: Hot reload not working
**Solution**: Try restarting the development server with `npm run dev`.

### Debugging Tools

- Use React DevTools for component inspection
- Check the browser console for errors
- Use `console.log` statements in your components
- Check Network tab in DevTools for API request issues

## Contributing

### Code Style

- Follow the existing code style
- Use TypeScript for all new components and pages
- Add appropriate PropTypes or TypeScript interfaces
- Keep components small and focused
- Use the existing UI components instead of creating new ones

### Workflow

1. Create a new branch for your feature or fix
2. Make your changes
3. Test your changes thoroughly
4. Submit a pull request

---

For more information about the project or to report issues, please contact the development team. 