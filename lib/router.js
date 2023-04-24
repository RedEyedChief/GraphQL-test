import express          from "express";
import ProductCreation  from "./services/ProductCreation";

const router = express.Router();

router.post("/products", ProductCreation);

export default router;