import { CreateProductDto } from "./dto/create-product.dto";
import { Types } from "mongoose";

export class CreateProductPayload extends CreateProductDto {
  owner: Types.ObjectId;
}
