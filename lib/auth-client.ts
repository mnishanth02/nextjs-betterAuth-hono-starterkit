import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        phone: { type: "string" },
        isAdmin: { type: "boolean" },
      },
    }),
  ],
  fetchOptions: {
    onError: (ctx) => {
      toast.error(ctx.error.message);
    },
  },
});

export const { signIn, signOut, signUp, useSession } = authClient;
