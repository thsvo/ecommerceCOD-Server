import { NextFunction, Request, Response } from "express";
import { reviewServices } from "./review.service";

const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const filePath = req.file ? req.file.path : undefined;

    const formData = {
      ...data,
      attachment: filePath,
    };

    const result = await reviewServices.createReviewService(formData);

    res.status(200).json({
      success: true,
      message: "Review Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSize = limit ? parseInt(limit as string, 10) : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = ["rating", "comment"];

    const result = await reviewServices.getAllReviewService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Reviews Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single Review data
const getSingleReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;
    const result = await reviewServices.getSingleReviewService(reviewId);
    res.status(200).json({
      success: true,
      message: "Review Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSingleReviewByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const result = await reviewServices.getSingleReviewByUserService(userId);
    res.status(200).json({
      success: true,
      message: "Review By User Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single Review controller
const updateSingleReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;
    const data = req.body;
    const filePath = req.file ? req.file.path : undefined;

    const reviewData = {
      ...data,
      attachment: filePath,
    };

    const result = await reviewServices.updateSingleReviewService(
      reviewId,
      reviewData
    );

    res.status(200).json({
      success: true,
      message: "Review Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete single Review controller
const deleteSingleReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;
    await reviewServices.deleteSingleReviewService(reviewId);
    res.status(200).json({
      success: true,
      message: "Review Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many Review controller
const deleteManyReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewIds = req.body;

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty Review IDs array provided",
        data: null,
      });
    }

    const result = await reviewServices.deleteManyReviewsService(reviewIds);

    res.status(200).json({
      success: true,
      message: `Bulk Review Delete Successful! Deleted ${result.deletedCount} Reviews.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const reviewControllers = {
  createReviewController,
  getAllReviewController,
  getSingleReviewController,
  getSingleReviewByUserController,
  updateSingleReviewController,
  deleteSingleReviewController,
  deleteManyReviewsController,
};
