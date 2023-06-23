import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ProductType } from "../product.types";

@Schema({ timestamps: true })
export class Product {
  @Prop({
    required: true,
    type: String,
  })
  title: string = "";

  @Prop({
    required: true,
    type: String,
    enum: Object.values(ProductType),
  })
  type: string;

  @Prop({
    required: false,
    type: String,
  })
  description: string = "";

  @Prop({
    required: false,
    type: [String],
  })
  tags: string[];

  @Prop({
    required: true,
    type: Number,
  })
  price: number;

  @Prop({
    required: true,
    type: Number,
    default: 0,
  })
  quantity: number;

  @Prop({
    required: false,
    type: String,
    default: "NGN",
  })
  currency: string = "NGN";

  @Prop({
    required: false,
    type: Boolean,
    default: false,
  })
  personalization: boolean = false;

  @Prop({
    required: false,
    type: [String],
  })
  variation: string[];

  @Prop({
    required: false,
    type: [
      {
        name: String,
        role: String,
      },
    ],
  })
  collaborationPartners: { name: string; role: string }[];

  @Prop({
    type: [String],
    required: false,
  })
  sections: string[];

  @Prop({
    required: true,
    type: [String],
  })
  images: string[];

  @Prop({
    required: false,
    min: 0,
    max: 100,
  })
  score: number;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "categories",
  })
  category: Types.ObjectId;

  @Prop({
    required: false,
    default: 0,
  })
  rating: number;

  @Prop({
    required: false,
    default: 0,
  })
  sales: number;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "users",
  })
  owner: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
  })
  policy: string = "";

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product).set(
  "versionKey",
  false
);
