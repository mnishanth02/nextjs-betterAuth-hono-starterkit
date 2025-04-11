"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
export const AdminButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/auth/sign-in"); // redirect to login page
            },
          },
        })
      }
    >
      Sign Out
    </Button>
  );
};
