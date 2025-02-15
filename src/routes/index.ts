import express from "express";
import userRoutes from "./UserRoutes";
import postRoutes from "./PostRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);

export default router;
