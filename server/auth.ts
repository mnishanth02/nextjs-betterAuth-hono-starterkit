import { env } from "@/env/server-env";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseUrl: env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      console.log("sendResetPassword", data, request);
      // Send an email to the user with a link to reset their password
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [organization(), admin()],
});
