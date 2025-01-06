import mongoose from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { ICategory } from "./category.interface";
import { CategoryLevel, categoryModel } from "./category.model";
import { formatResultImage } from "../../utils/formatResultImage";

//Create a category into database
const createCategoryService = async (
  categoryData: ICategory,
  filePath?: string
) => {
  const dataToSave = { ...categoryData, filePath };

  // Create the new category
  const newCategory = await categoryModel.create(dataToSave);

  if (
    categoryData.level === CategoryLevel.CATEGORY &&
    categoryData.parentCategory
  ) {
    await categoryModel.findByIdAndUpdate(
      categoryData.parentCategory,
      { $addToSet: { categories: newCategory._id } },
      { new: true }
    );
  }

  if (
    categoryData.level === CategoryLevel.SUB_CATEGORY &&
    categoryData.categories
  ) {
    const parentCategory = await categoryModel.findById(
      categoryData.categories
    );

    if (parentCategory && parentCategory.level === CategoryLevel.CATEGORY) {
      // Add the new subcategory to the parent category
      await categoryModel.findByIdAndUpdate(
        parentCategory._id,
        { $addToSet: { subcategories: newCategory._id } },
        { new: true }
      );

      if (parentCategory.parentCategory) {
        await categoryModel.findByIdAndUpdate(
          parentCategory.parentCategory,
          { $addToSet: { subcategories: newCategory._id } },
          { new: true }
        );
      }
    }
  }

  // Return the newly created category
  return newCategory;
};

// Get all categories with optional pagination
const getAllCategoriesService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = categoryModel
      .find()
      .populate({
        path: "categories",
        populate: { path: "subcategories" },
      })
      .populate("subcategories")
      .populate("parentCategory");

    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    result.results = formatResultImage<ICategory>(
      result.results,
      "attachment"
    ) as ICategory[];

    return result;
  } else {
    results = await categoryModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: "categories",
        populate: { path: "subcategories" },
      })
      .populate("subcategories")
      .populate("parentCategory")
      .exec();

    results = formatResultImage(results, "attachment");

    return {
      results,
    };
  }
};

//Get single category
const getSingleCategoryService = async (categoryId: number | string) => {
  const queryId =
    typeof categoryId === "string"
      ? new mongoose.Types.ObjectId(categoryId)
      : categoryId;

  const result = await categoryModel
    .findById(queryId)
    .populate("categories")
    .populate("subcategories")
    .populate("parentCategory")
    .exec();
  if (!result) {
    throw new Error("category not found");
  }

  if (typeof result.attachment === "string") {
    const formattedAttachment = formatResultImage<ICategory>(result.attachment);
    if (typeof formattedAttachment === "string") {
      result.attachment = formattedAttachment;
    }
  }

  return result;
};

//Update single category
const updateSingleCategoryService = async (
  categoryId: string | number,
  categoryData: ICategory
) => {
  const queryId =
    typeof categoryId === "string"
      ? new mongoose.Types.ObjectId(categoryId)
      : categoryId;

  const existingCategory = await categoryModel.findById(queryId);
  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const updatedCategory = await categoryModel
    .findByIdAndUpdate(
      queryId,
      { $set: categoryData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!updatedCategory) {
    throw new Error("Category not found after update");
  }

  if (
    updatedCategory.level === CategoryLevel.CATEGORY &&
    updatedCategory.parentCategory &&
    updatedCategory.parentCategory.toString() !==
      existingCategory.parentCategory?.toString()
  ) {
    if (existingCategory.parentCategory) {
      await categoryModel.findByIdAndUpdate(existingCategory.parentCategory, {
        $pull: { subcategories: updatedCategory._id },
      });
    }
    await categoryModel.findByIdAndUpdate(updatedCategory.parentCategory, {
      $addToSet: { subcategories: updatedCategory._id },
    });
  }

  if (
    updatedCategory.level === CategoryLevel.SUB_CATEGORY &&
    updatedCategory.categories &&
    updatedCategory.categories.toString() !==
      existingCategory.categories?.toString()
  ) {
    const parentCategory = await categoryModel.findById(
      updatedCategory.categories
    );

    if (parentCategory && parentCategory.level === CategoryLevel.CATEGORY) {
      if (existingCategory.categories) {
        await categoryModel.findByIdAndUpdate(existingCategory.categories, {
          $pull: { subcategories: updatedCategory._id },
        });
      }

      await categoryModel.findByIdAndUpdate(parentCategory._id, {
        $addToSet: { subcategories: updatedCategory._id },
      });

      if (parentCategory.parentCategory) {
        await categoryModel.findByIdAndUpdate(parentCategory.parentCategory, {
          $addToSet: { subcategories: updatedCategory._id },
        });
      }
    }
  }

  return updatedCategory;
};

//Delete single category
const deleteSingleCategoryService = async (categoryId: string | number) => {
  const queryId =
    typeof categoryId === "string"
      ? new mongoose.Types.ObjectId(categoryId)
      : categoryId;

  const result = await categoryModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("category not found");
  }

  return result;
};

//Delete many category
const deleteManyCategoriesService = async (
  categoryIds: (string | number)[]
) => {
  const queryIds = categoryIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const result = await categoryModel
    .deleteMany({ _id: { $in: queryIds } })
    .exec();

  return result;
};

export const categoryServices = {
  createCategoryService,
  getAllCategoriesService,
  getSingleCategoryService,
  updateSingleCategoryService,
  deleteSingleCategoryService,
  deleteManyCategoriesService,
};
