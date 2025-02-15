import express from "express";
import { getPosts, createPost } from "../controllers/PostController";
import { postValidationRules } from "../validations/PostValidation";
import { validate } from "../middlewares/ValidateMiddleware";

const router = express.Router();

router.get("/", getPosts);
router.post("/", postValidationRules, validate, createPost);

export default router;
