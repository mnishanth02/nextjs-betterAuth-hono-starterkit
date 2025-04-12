import { Hono } from "hono";
import { editProfile, getProfile, getUserById, getUsers } from "../controllers";
import { isAdmin, protect } from "../middleware";

const users = new Hono();

// Get All Users
users.get("/", isAdmin, getUsers);

// Get User Profile
users.get("/profile", protect, getProfile);

// // Edit User Profile
users.put("/profile", protect, editProfile);

// // Get Single User
users.get("/:id", protect, getUserById);

export default users;
