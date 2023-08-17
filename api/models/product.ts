import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  desc: string;
  img: string;
  categories?: string[];
  size?: string;
  color?: string;
  price: number;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
