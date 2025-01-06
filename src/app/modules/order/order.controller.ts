import { NextFunction, Request, Response } from "express";
import { orderServices } from "./order.service";
import { orderModel } from "./order.model";
import config from "../../config";

const initiateOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const formData = {
      ...data,
    };
    const result = await orderServices.initiateOrderService(formData);

    res.status(200).json({
      success: true,
      message: "Order Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const sslOrderSuccessController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tranId } = req.params;

    if (!tranId) {
      throw new Error("Transaction ID not provided");
    }

    await orderServices.handleSSLOrderSuccessService(tranId);

    res.redirect(`${config.client_url}/success`);
  } catch (error) {
    next(error);
  }
};

const getAllOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSize = limit ? parseInt(limit as string, 10) : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = ["name", "options"];

    const result = await orderServices.getAllOrderService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Orders Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrderByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;
    const { userId } = req.params;

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSize = limit ? parseInt(limit as string, 10) : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = ["name", "options"];

    const result = await orderServices.getAllOrderByUserService(
      userId,
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Orders By User Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single Order data
const getSingleOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const result = await orderServices.getSingleOrderService(orderId);
    res.status(200).json({
      success: true,
      message: "Order Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single Order controller
const updateSingleOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const data = req.body;

    const orderData = {
      ...data,
    };

    const result = await orderServices.updateSingleOrderService(
      orderId,
      orderData
    );

    res.status(200).json({
      success: true,
      message: "Order Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete single Order controller
const deleteSingleOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    await orderServices.deleteSingleOrderService(orderId);
    res.status(200).json({
      success: true,
      message: "Order Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many Order controller
const deleteManyOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderIds = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty Order IDs array provided",
        data: null,
      });
    }

    const result = await orderServices.deleteManyOrdersService(orderIds);

    res.status(200).json({
      success: true,
      message: `Bulk Order Delete Successful! Deleted ${result.deletedCount} Orders.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const orderControllers = {
  initiateOrderController,
  sslOrderSuccessController,
  getAllOrderController,
  getAllOrderByUserController,
  getSingleOrderController,
  updateSingleOrderController,
  deleteSingleOrderController,
  deleteManyOrdersController,
};
