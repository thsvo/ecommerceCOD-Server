import express from "express";
import { uploadService } from "../upload/upload";
import { orderControllers } from "./order.controller";

const router = express.Router();

router.post(
  "/order/initiate/",
  uploadService.none(),
  orderControllers.initiateOrderController
);

router.post(
  "/order/ssl/success/:tranId/",
  orderControllers.sslOrderSuccessController
);

router.get("/order/", orderControllers.getAllOrderController);

router.get(
  "/order/user/:userId/",
  orderControllers.getAllOrderByUserController
);

router.get("/order/:orderId/", orderControllers.getSingleOrderController);

router.patch(
  "/order/:orderId/",
  uploadService.none(),
  orderControllers.updateSingleOrderController
);

router.delete("/order/:orderId/", orderControllers.deleteSingleOrderController);

router.post("/order/bulk-delete/", orderControllers.deleteManyOrdersController);

export const orderRoutes = router;
