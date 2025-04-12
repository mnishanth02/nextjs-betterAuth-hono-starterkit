import { env } from "@/env/server-env";
import { hashPassword, verifyPassword } from "@/lib/utils/hash";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

// Initialize BetterAuth
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseUrl: env.BETTER_AUTH_URL,
  user: {
    modelName: "users",
    additionalFields: {
      phone: { type: "string", nullable: true, returned: true },
      isAdmin: { type: "boolean", default: false, returned: true },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
        //TODO: Send change email verification
        console.log("sendChangeEmailVerification", user, newEmail, url, token);
        // sendEmail({
        //   to: newEmail,
        //   subject: 'Verify your new email',
        //   text: `Click the link to verify your new email: ${url}`,
        // })
      },
    },
  },
  session: { modelName: "sessions" },
  account: {
    modelName: "accounts",
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google", "email-password"],
      allowDifferentEmails: false,
      sendAccountLinkingEmail: async ({ user, url, token }) => {
        // TODO: Send account linking email
        console.log("sendAccountLinkingEmail", user, url, token);
        // sendEmail({
        //   to: user.email,
        //   subject: 'Link your account',
        //   text: `Click the link to confirm linking your account: ${url}`,
        // })
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    disableSignUp: false, // Enable/Disable sign up
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    // Password hashing configuration
    password: {
      hash: async (password) => {
        return await hashPassword(password);
        // return await Bun.password.hash(password, {
        //   algorithm: 'bcrypt',
        //   cost: 10,
        // })
      },
      verify: async ({ password, hash }) => {
        return await verifyPassword(password, hash);
      },
    },
    // Email verification configuration
    requireEmailVerification: false,
    emailVerification: {
      sendVerificationEmail: async ({ user, url, token }) => {
        // TODO: Send verification email
        console.log("sendVerificationEmail", user, url, token);
        // await sendEmail({
        //   to: user.email,
        //   subject: 'Verify your email',
        //   text: `Click the link to verify your email: ${url}`,
        // })
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 3600, // 1 hour
    },
    // Password reset configuration
    sendResetPassword: async ({ user, url, token }, request) => {
      // TODO: Send reset password email
      console.log("sendResetPassword", user, url, token, request?.mode);
      // await sendEmail({
      //   to: user.email,
      //   subject: 'Reset your password',
      //   text: `Click the link to reset your password: ${url}`,
      // })
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [admin()],
});
