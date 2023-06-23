import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/v1/auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "./modules/v1/user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryModule } from "./modules/v1/category/category.module";
import { ServiceModule } from "./modules/v1/service/service.module";
import { ProductModule } from "./modules/v1/product/product.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    UserModule,
    CategoryModule,
    ServiceModule,
    ProductModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
