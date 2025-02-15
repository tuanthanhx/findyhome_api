import { Request, Response } from "express";
import Product from "./product.model";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// export const createProduct = async (req: Request, res: Response) => {
//   try {
//     const { username, email, password } = req.body;
//     const user = new User({ username, email, password });
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
