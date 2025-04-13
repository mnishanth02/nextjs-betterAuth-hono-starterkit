import { Hono } from "hono";
import { editProfile, getProfile, getUserById, getUsers } from "../controllers/user.controller";
import { isAdmin, protect } from "../middleware";

// Create a new router instance
const userRouter = new Hono()
  .get("/", isAdmin, getUsers)
  .get("/me", protect, getProfile)
  .put("/profile", protect, editProfile)
  .get("/:id", protect, getUserById);

export default userRouter;
