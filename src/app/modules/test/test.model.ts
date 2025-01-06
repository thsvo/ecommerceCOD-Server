import { model, Schema, Model } from "mongoose";
import { ITest } from "./test.interface";
import { Status } from "../../interface/global/global.interface";

// Define the schema
const testSchema = new Schema<ITest>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    number: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    attachment: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

// Define a static method for the model
testSchema.statics.isTestExists = async function (
  testId: number | string
): Promise<boolean> {
  const existingTest = await this.findOne({ _id: testId });
  return !!existingTest;
};

// Create an interface that includes the static methods
interface TestModel extends Model<ITest> {
  isTestExists(testId: number | string): Promise<boolean>;
}

// Create and export the model
export const testModel = model<ITest, TestModel>("Test", testSchema);
