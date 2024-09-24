import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không có trong DTO
      forbidNonWhitelisted: true, // Trả về lỗi nếu có thuộc tính không hợp lệ
      transform: true, // Tự động chuyển đổi dữ liệu đầu vào thành kiểu DTO
    }),
  );

  app.enableCors({
    origin: '*', // Thay đổi URL này theo yêu cầu của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Nếu bạn cần gửi cookie cùng với yêu cầu
    allowedHeaders: 'Content-Type, Authorization', // Các header cho phép
  });
  await app.listen(3000);
}
bootstrap();
