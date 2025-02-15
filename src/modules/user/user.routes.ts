import express from "express";
import { getUsers, createUser } from "./user.controller";
import { userValidationRules } from "./user.validator";

// import { validate } from "../../middlewares/validate.middleware";

const router = express.Router();

router.get("/", getUsers);
// router.post("/", userValidationRules, validate, createUser);
router.post("/", userValidationRules, createUser);

export default router;
