import express from "express";
import { getUsers, createUser } from "../controllers/UserController";
import { userValidationRules } from "../validations/UserValidation";
import { validate } from "../middlewares/ValidateMiddleware";

const router = express.Router();

router.get("/", getUsers);
router.post("/", userValidationRules, validate, createUser);

export default router;
