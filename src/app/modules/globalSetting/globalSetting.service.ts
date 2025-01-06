import mongoose from "mongoose";
import { formatResultImage } from "../../utils/formatResultImage";
import { IGlobalSetting } from "./globalSetting.interface";
import { globalSettingModel } from "./globalSetting.model";

//Create a globalSetting into database
const createGlobalSettingService = async (
  globalSettingData: IGlobalSetting,
  filePath?: string
) => {
  const dataToSave = { ...globalSettingData, filePath };
  const result = await globalSettingModel.create(dataToSave);
  return result;
};

// Get all globalSetting with optional pagination
const getAllGlobalSettingService = async () => {
  let results;

  results = await globalSettingModel.find().exec();

  results = formatResultImage(results, "logo");
  results = formatResultImage(results, "favicon");

  return {
    result: results[0] || null,
  };
};

//Update single globalSetting
const updateSingleGlobalSettingService = async (
  globalSettingId: string | number,
  globalSettingData: IGlobalSetting
) => {
  const queryId =
    typeof globalSettingId === "string"
      ? new mongoose.Types.ObjectId(globalSettingId)
      : globalSettingId;

  const result = await globalSettingModel
    .findByIdAndUpdate(
      queryId,
      { $set: globalSettingData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Global Setting not found");
  }

  return result;
};

export const globalSettingServices = {
  createGlobalSettingService,
  getAllGlobalSettingService,
  updateSingleGlobalSettingService,
};
