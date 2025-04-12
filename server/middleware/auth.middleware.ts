import type { Context } from "@/types/server";
import type { Next } from "hono";
import { auth } from "../auth";
// Middleware to protect routes from unauthorized access
export const protect = async (c: Context, next: Next) => {
  // Extract the session from the incoming request headers
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  // If no valid session or user is found, return an unauthorized response
  if (!session || !session.user) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
        error: "No valid session found",
      },
      401
    );
  }

  console.log(session.user);
  // Optionally set the user and session on the context variables
  c.set("user", session.user);
  c.set("session", session.session);

  // Continue to the next middleware/handler
  await next();
};

// Middleware to protect admin routes
export const isAdmin = async (c: Context, next: Next) => {
  // Extract the session from the incoming request headers
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  // If no valid session or user is found, return an unauthorized response
  if (!session || !session.user) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
        error: "No valid session found",
      },
      401
    );
  }

  // Check if the user is an admin
  if (!session.user.isAdmin) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
        error: "User is not an admin",
      },
      403
    );
  }

  // Optionally set the user and session on the context variables
  c.set("user", session.user);
  c.set("session", session.session);

  // Continue to the next middleware/handler
  await next();
};
