import { cn } from "@/lib/utils";

export const metadata = {
  title: {
    template: "%s | Starter Kit",
    default: "Authentication | Starter Kit",
  },
  description: "Secure authentication for your Starter Kit account",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className={cn("flex min-h-screen items-center justify-center ")}>{children}</div>;
};

export default AuthLayout;
