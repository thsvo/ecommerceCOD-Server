import { NextFunction, Request, Response } from "express";
import { globalSettingServices } from "./globalSetting.service";

const createGlobalSettingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const logoFile = files?.logo?.[0];
    const faviconFile = files?.favicon?.[0];

    const formData = {
      ...data,
      logo: logoFile?.path,
      favicon: faviconFile?.path,
    };

    const result = await globalSettingServices.createGlobalSettingService(
      formData
    );

    res.status(200).json({
      success: true,
      message: "Global Setting Created Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllGlobalSettingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await globalSettingServices.getAllGlobalSettingService();

    res.status(200).json({
      success: true,
      message: "Global Settings Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Update single GlobalSetting controller
const updateSingleGlobalSettingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { globalSettingId } = req.params;
    const data = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const logoFilePath = files?.logo?.[0]?.path;
    const faviconFilePath = files?.favicon?.[0]?.path;

    const globalSettingData = {
      ...data,
      logo: logoFilePath,
      favicon: faviconFilePath,
    };

    const result = await globalSettingServices.updateSingleGlobalSettingService(
      globalSettingId,
      globalSettingData
    );

    res.status(200).json({
      success: true,
      message: "Global Setting Data Updated Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const globalSettingControllers = {
  createGlobalSettingController,
  getAllGlobalSettingController,
  updateSingleGlobalSettingController,
};
