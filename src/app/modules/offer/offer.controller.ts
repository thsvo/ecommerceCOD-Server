import { NextFunction, Request, Response } from "express";
import { offerServices } from "./offer.service";

const createOfferController = async (
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

    const result = await offerServices.createOfferService(formData);

    res.status(200).json({
      success: true,
      message: "Offer Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllOfferController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSize = limit ? parseInt(limit as string, 10) : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = [
      "name",
      "description",
      "price",
      "discount",
      "startDate",
      "endDate",
    ];

    const result = await offerServices.getAllOfferService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Offers Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single Offer data
const getSingleOfferController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { offerId } = req.params;
    const result = await offerServices.getSingleOfferService(offerId);
    res.status(200).json({
      success: true,
      message: "Offer Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single Offer controller
const updateSingleOfferController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { offerId } = req.params;
    const data = req.body;
    const filePath = req.file ? req.file.path : undefined;

    const offerData = {
      ...data,
      attachment: filePath,
    };

    const result = await offerServices.updateSingleOfferService(
      offerId,
      offerData
    );

    res.status(200).json({
      success: true,
      message: "Offer Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete single Offer controller
const deleteSingleOfferController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { offerId } = req.params;
    await offerServices.deleteSingleOfferService(offerId);
    res.status(200).json({
      success: true,
      message: "Offer Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many Offer controller
const deleteManyOfferController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const offerIds = req.body;

    if (!Array.isArray(offerIds) || offerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty Offer IDs array provided",
        data: null,
      });
    }

    const result = await offerServices.deleteManyOfferService(offerIds);

    res.status(200).json({
      success: true,
      message: `Bulk Offer Delete Successful! Deleted ${result.deletedCount} Offer.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const offerControllers = {
  createOfferController,
  getAllOfferController,
  getSingleOfferController,
  updateSingleOfferController,
  deleteSingleOfferController,
  deleteManyOfferController,
};
