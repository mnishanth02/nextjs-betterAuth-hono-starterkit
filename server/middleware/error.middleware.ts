import type { ErrorHandler, NotFoundHandler } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";

// Error Handler
export const errorHandler: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err ? err.status : c.newResponse(null).status;

  const statusCode = currentStatus !== 200 ? (currentStatus as StatusCode) : 500;
  const env = c.env?.NODE_ENV || process.env?.NODE_ENV;

  return c.json(
    {
      success: false,
      message: err?.message || "Internal Server Error",
      stack: env ? null : err?.stack,
    },
    statusCode as ContentfulStatusCode
  );
};

// Not Found Handler
export const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      success: false,
      message: `Not Found - [${c.req.method}]:[${c.req.url}]`,
    },
    404 // Explicitly set 404 status
  );
};
