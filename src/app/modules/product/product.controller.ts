import { NextFunction, Request, Response } from "express";
import { productServices } from "./product.service";

const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as Express.Multer.File[];
    const mainImage = files.find(
      (file) => file.fieldname === "mainImage"
    )?.path;

    const variants = [];
    if (req.body.variants) {
      for (const [index] of Object.keys(req.body.variants).entries()) {
        const variant = req.body.variants[index];
        const variantImage = files.find(
          (file) => file.fieldname === `variants[${index}][image]`
        )?.path;

        variants.push({
          ...variant,
          image: variantImage,
        });
      }
    }

    const productData = {
      ...req.body,
      mainImage,
      variants,
    };

    const result = await productServices.createProductService(productData);

    res.status(200).json({
      success: true,
      message: "Product Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSize = limit ? parseInt(limit as string, 10) : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = ["name"];

    const result = await productServices.getAllProductService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Products Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single Product data
const getSingleProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const result = await productServices.getSingleProductService(productId);
    res.status(200).json({
      success: true,
      message: "Product Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSingleProductBySkuController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sku } = req.params;
    const result = await productServices.getSingleProductBySkuService(sku);
    res.status(200).json({
      success: true,
      message: "Product By SkU Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Get single Product data by slug
const getSingleProductBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productSlug } = req.params;
    const result = await productServices.getSingleProductBySlugService(
      productSlug
    );
    res.status(200).json({
      success: true,
      message: "Product Fetched by Slug Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single Product controller
const updateSingleProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const data = req.body;
    const filePath = req.file ? req.file.path : undefined;

    const productData = {
      ...data,
      attachment: filePath,
    };

    const result = await productServices.updateSingleProductService(
      productId,
      productData
    );

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete single Product controller
const deleteSingleProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    await productServices.deleteSingleProductService(productId);
    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many Product controller
const deleteManyProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productIds = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty Product IDs array provided",
        data: null,
      });
    }

    const result = await productServices.deleteManyProductsService(productIds);

    res.status(200).json({
      success: true,
      message: `Bulk Product Delete Successful! Deleted ${result.deletedCount} Products.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const ProductControllers = {
  createProductController,
  getAllProductController,
  getSingleProductController,
  getSingleProductBySkuController,
  getSingleProductBySlugController,
  updateSingleProductController,
  deleteSingleProductController,
  deleteManyProductsController,
};
