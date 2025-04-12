import type { Env, Variables } from "@/types/server";
import { Hono } from "hono";
import { editProfile, getProfile, getUserById, getUsers } from "../controllers/user.controller";
import { isAdmin, protect } from "../middleware";

// Create a new router instance
const userRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// User routes
userRouter.get("/", isAdmin, getUsers);

userRouter.get("/me", protect, getProfile);

// // Edit User Profile
userRouter.put("/profile", protect, editProfile);

// // Get Single User
userRouter.get("/:id", protect, getUserById);

export default userRouter;
