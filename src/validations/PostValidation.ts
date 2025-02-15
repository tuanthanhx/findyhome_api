import { body } from "express-validator";

export const postValidationRules = [
  body("title").isString().notEmpty().withMessage("title is required"),
  body("content").isString().withMessage("Invalid content format"),
];
