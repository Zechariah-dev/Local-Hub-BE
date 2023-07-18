import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  name: string = "";

  @Prop({
    required: true,
    type: String,
  })
  description: string = "";

  @Prop({
    required: false,
    type: String,
  })
  image: string = "";

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category).set(
  "versionKey",
  false
);
