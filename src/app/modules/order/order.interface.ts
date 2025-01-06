import { Types } from "mongoose";

export interface IOrder {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
    productName: string;
    sku: string;
  }[];
  amount: number;
  name: string;
  email: string;
  number: string;
  address: string;
  code: string;
  discount: string | number;
  subTotal: string | number;
  trackingCode: string;
  invoice: string;
  deviceId: string;
  shippingFee: string | number;
  grandTotal: string | number;
  deliverOption: string;
  paymentType: "manual" | "ssl";
  paymentMethod?: string;
  tranId?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  status: string;
}
