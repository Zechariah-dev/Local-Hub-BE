import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ResponseInterceptor } from "./interceptors/respnse.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger("Main");

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  // swagger doc setup
  const config = new DocumentBuilder()
    .setTitle("Local Hub")
    .setDescription("The Local Hub API")
    .setVersion("1.0")
    .addTag("Local Hub")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const configService = app.get(ConfigService);

  const port = configService.get<number>("PORT") || 8888;

  await app.listen(port, () => {
    logger.log(`Server listening on port ${port}`);
  });
}

bootstrap();
