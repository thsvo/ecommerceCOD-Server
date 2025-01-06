import { NextFunction, Request, Response } from "express";
import { categoryServices } from "./category.service";

const createCategoryController = async (
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

    const result = await categoryServices.createCategoryService(formData);

    res.status(200).json({
      success: true,
      message: "Category Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSize = limit ? parseInt(limit as string, 10) : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = ["name", "level"];

    const result = await categoryServices.getAllCategoriesService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Categories Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single Category data
const getSingleCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryServices.getSingleCategoryService(categoryId);
    res.status(200).json({
      success: true,
      message: "Category Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single Category controller
const updateSingleCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const data = req.body;
    const filePath = req.file ? req.file.path : undefined;

    const categoryData = {
      ...data,
      attachment: filePath,
    };

    const result = await categoryServices.updateSingleCategoryService(
      categoryId,
      categoryData
    );

    res.status(200).json({
      success: true,
      message: "Category Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete single Category controller
const deleteSingleCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    await categoryServices.deleteSingleCategoryService(categoryId);
    res.status(200).json({
      success: true,
      message: "Category Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many Category controller
const deleteManyCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryIds = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty Category IDs array provided",
        data: null,
      });
    }

    const result = await categoryServices.deleteManyCategoriesService(
      categoryIds
    );

    res.status(200).json({
      success: true,
      message: `Bulk Categories Delete Successful! Deleted ${result.deletedCount} Categories.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const CategoryControllers = {
  createCategoryController,
  getAllCategoriesController,
  getSingleCategoryController,
  updateSingleCategoryController,
  deleteSingleCategoryController,
  deleteManyCategoriesController,
};
