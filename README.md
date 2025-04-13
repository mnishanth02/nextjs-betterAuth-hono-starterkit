# Next.js Hono BetterAuth Starter Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A starter kit for building modern web applications using Next.js, Hono, BetterAuth, shadcn/ui, Drizzle ORM, TanStack Query, Zustand, and Biome.

## ✨ Features

*   **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
*   **Backend API:** [Hono](https://hono.dev/) integrated within Next.js API routes
*   **Authentication:** [BetterAuth](https://better-auth.dev/) for secure and easy authentication flows
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
*   **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/) with [Neon](https://neon.tech/) Serverless Postgres
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) for simple global state
*   **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest) for server-state management
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with `tw-animate-css` & `tailwind-merge`
*   **Form Handling:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) resolver
*   **Linting & Formatting:** [Biome](https://biomejs.dev/) for fast and comprehensive code quality checks
*   **Type Checking:** [TypeScript](https://www.typescriptlang.org/)
*   **Environment Variables:** Type-safe environment variables with [@t3-oss/env-nextjs](https://env.t3.gg/)
*   **Hooks:** Pre-commit hooks with [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged)

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (>= 18.x recommended)
*   [Bun](https://bun.sh/) (>= 1.0.0)
*   A [Neon](https://neon.tech/) account and database connection string.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mnishanth02/nextjs-betterAuth-hono-starterkit.git
    cd nextjs-hono-betterauth-starterkit
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    *   Copy the `.env.example` file to `.env`.
    *   Fill in the required environment variables, especially your `DATABASE_URL` from Neon and any BetterAuth related keys.
    ```bash
    cp .env.example .env
    # Open .env and add your variables
    ```

4.  **Generate database schema:**
    *   Ensure your database connection string is correctly set in `.env`.
    *   Run the Drizzle Kit generation command:
    ```bash
    bun run db:generate
    ```

5.  **Migrate the database:**
    *   Apply the migrations to your database:
    ```bash
    bun run db:migrate
    ```

### Running the Development Server

Start the Next.js development server (with Turbopack):

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

*   `bun run dev`: Starts the development server with Turbopack.
*   `bun run build`: Creates a production build of the application.
*   `bun run start`: Starts the production server.
*   `bun run lint`: Runs Biome to check for linting and formatting issues.
*   `bun run format`: Runs Biome to automatically fix formatting issues.
*   `bun run check`: Runs both linting and type checking.
*   `bun run db:generate`: Generates Drizzle ORM migration files based on schema changes.
*   `bun run db:migrate`: Applies pending database migrations.
*   `bun run db:studio`: Opens Drizzle Studio to inspect your database.

## 🔧 Configuration

*   **Environment Variables:** Managed in `.env` (refer to `.env.example` and `src/env.js` for schema).
*   **Tailwind CSS:** Configuration is in `tailwind.config.ts`.
*   **Biome:** Configuration is in `biome.json`.
*   **TypeScript:** Configuration is in `tsconfig.json`.
*   **Drizzle ORM:** Schema is typically defined in `src/db/schema.ts` and configuration in `drizzle.config.ts`.
*   **BetterAuth:** Configuration usually involves environment variables and setup within API routes or middleware.
*   **Hono:** Routes are typically defined within the `src/app/api/[[...route]]/route.ts` file or similar.

##  B BetterAuth Integration

This starter kit uses BetterAuth for authentication. Key setup points:

1.  Configure BetterAuth provider credentials and settings in your `.env` file.
2.  Implement authentication routes (e.g., login, signup, logout) using the BetterAuth library within your Hono API handlers.
3.  Protect pages and API routes using authentication checks, potentially leveraging middleware.

Refer to the [BetterAuth documentation](https://better-auth.dev/docs) for detailed integration guides.

## 💾 Database (Drizzle + Neon)

*   Define your database schema in `src/db/schema.ts`.
*   After modifying the schema, run `bun run db:generate` to create migration files.
*   Run `bun run db:migrate` to apply the migrations to your Neon database.
*   Use `bun run db:studio` to visually interact with your database during development.

## 🌐 Deployment

Deploy your application to platforms like [Vercel](https://vercel.com/) (recommended for Next.js) or others that support Node.js applications.

Ensure you configure your environment variables (including `DATABASE_URL`) in your deployment platform's settings.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 🧑‍💻 Author

*   **Nishanth Murugan** - [nishanth.murugan@gmail.com](mailto:nishanth.murugan@gmail.com)

Project Link: [https://github.com/mnishanth02/nextjs-betterAuth-hono-starterkit](https://github.com/mnishanth02/nextjs-betterAuth-hono-starterkit)
