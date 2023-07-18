import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { Category } from "./category/schemas/category.schema";
import { ServiceModule } from "./service/service.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { UserModule } from "./user/user.module";

@Module({
  providers: [
    AuthModule,
    // Category,
    ServiceModule,
    CloudinaryModule,
    UserModule,
  ],
})
export class V1Module {}
