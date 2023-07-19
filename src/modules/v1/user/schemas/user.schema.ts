import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { UserRole } from "../user.interface";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string = "";

  @Prop({
    required: true,
    type: String,
  })
  fullname: string = "";

  @Prop({
    required: false,
    type: String,
  })
  image: string = "";

  @Prop({
    required: true,
    type: String,
  })
  password: string = "";

  @Prop({
    required: true,
    type: Boolean,
  })
  termsAndCondition = false;

  @Prop({
    required: true,
    type: String,
  })
  phone: string = "";

  @Prop({
    required: true,
    type: String,
  })
  country: String = "";

  @Prop({
    required: true,
    type: String,
    enum: Object.values(UserRole),
  })
  role: string = "";

  @Prop({
    required: false,
    type: Date,
  })
  dob: Date;

  @Prop({
    required: false,
    type: String,
  })
  username: string = "";

  @Prop({
    required: false,
    type: String,
  })
  address: string = "";

  @Prop({
    required: false,
    type: [String],
  })
  languages: string[];

  @Prop({
    required: false,
    type: String,
  })
  bio: string = "";

  @Prop({
    required: false,
    type: [String],
  })
  skills: string[];

  @Prop({
    required: false,
    type: [Types.ObjectId],
    ref: "categories",
  })
  categories: Types.ObjectId[];

  @Prop({
    required: false,
    type: {
      email: String,
      cac: String,
      phone: String,
    },
  })
  verifiedInformation: {
    email: string;
    cac: string;
    phone: string;
  };

  @Prop({
    required: false,
    type: String,
  })
  bussinessImage: string = "";

  @Prop({
    required: false,
    type: String,
  })
  bussinessCoverImage: string = "";

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User).set(
  "versionKey",
  false
);
