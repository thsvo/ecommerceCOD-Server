import { NextFunction, Request, Response } from "express";
import { compareServices } from "./compare.service";

const createCompareController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const formData = {
      ...data,
    };

    const result = await compareServices.createCompareService(formData);

    res.status(200).json({
      success: true,
      message: "Compare Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllCompareController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSize = limit ? parseInt(limit as string, 10) : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = ["price", "quantity"];

    const result = await compareServices.getAllCompareService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Compares Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single Compare data
const getSingleCompareController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { compareId } = req.params;
    const result = await compareServices.getSingleCompareService(compareId);
    res.status(200).json({
      success: true,
      message: "Compare Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSingleCompareBuyUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const result = await compareServices.getSingleCompareByUserService(userId);
    res.status(200).json({
      success: true,
      message: "Compare By User Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single Compare controller
const updateSingleCompareController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { compareId } = req.params;
    const data = req.body;

    const compareData = {
      ...data,
    };

    const result = await compareServices.updateSingleCompareService(
      compareId,
      compareData
    );

    res.status(200).json({
      success: true,
      message: "Compare Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete single Compare controller
const deleteSingleCompareController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { compareId } = req.params;
    await compareServices.deleteSingleCompareService(compareId);
    res.status(200).json({
      success: true,
      message: "Compare Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many Compare controller
const deleteManyCompareController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const compareIds = req.body;

    if (!Array.isArray(compareIds) || compareIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty Compare IDs array provided",
        data: null,
      });
    }

    const result = await compareServices.deleteManyCompareService(compareIds);

    res.status(200).json({
      success: true,
      message: `Bulk Compare Delete Successful! Deleted ${result.deletedCount} Compares.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const compareControllers = {
  createCompareController,
  getAllCompareController,
  getSingleCompareController,
  getSingleCompareBuyUserController,
  updateSingleCompareController,
  deleteSingleCompareController,
  deleteManyCompareController,
};
