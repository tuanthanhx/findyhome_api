import express from "express";
import { getProducts, createProduct } from "./product.controller";
// import { userValidationRules } from "./product.validator";

// import { validate } from "../../middlewares/validate.middleware";

const router = express.Router();

router.get("/", getProducts);
// router.post("/", userValidationRules, validate, createUser);
// router.post("/", userValidationRules, createUser);

export default router;
