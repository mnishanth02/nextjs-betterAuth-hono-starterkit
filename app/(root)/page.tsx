import { buttonVariants } from "@ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" min-h-screen flex-center flex-col">
      <h1 className="font-bold text-4xl">Starter Kit</h1>
      <p className="text-muted-foreground">
        This is a starter kit for your next project. It is a simple project that is built with
        Next.js with integrated Hono as a backend, Tailwind CSS, and TypeScript.
      </p>
      <p className="text-muted-foreground">Better-auth is integrated for authentication.</p>
      <Link href="/auth/sign-in" className={buttonVariants({ variant: "default" })}>
        Login
      </Link>
    </div>
  );
}
