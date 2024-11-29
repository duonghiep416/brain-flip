import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlacklistTokenModule } from './blacklist_token/blacklist_token.module';
import { AuthMiddleWare } from 'src/middleware/auth.middleware';
import { BlacklistToken } from 'src/blacklist_token/entities/blacklist_token.entity';
import { TokenService } from 'src/shared/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { FlashcardSetModule } from './flashcard_set/flashcard_set.module';
import { FlashcardModule } from './flashcard/flashcard.module';
import { FlashcardBookmarkModule } from './flashcard_bookmark/flashcard_bookmark.module';
import { FlashcardSetPermissionModule } from './flashcard_set_permission/flashcard_set_permission.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlacklistToken]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MailerModule
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: false, // false cho STARTTLS, true cho SSL
          auth: {
            user: config.get('MAIL_USER'), // Địa chỉ Gmail
            pass: config.get('MAIL_PASSWORD'), // Mật khẩu ứng dụng Gmail
          },
        },
        defaults: {
          from: `No Reply <${config.get('MAIL_USER')}>`, // Địa chỉ email gửi mặc định
        },
        template: {
          dir: process.cwd() + '/src/templates/', // Thư mục chứa templates
          adapter: new HandlebarsAdapter(), // Sử dụng Handlebars cho templates
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [join(process.cwd(), 'dist/**/*.entity.js')],
          // do NOT use synchronize in production - otherwise you may lose production data
          synchronize: true,
        };
      },
    }),
    UserModule,
    AuthModule,
    BlacklistTokenModule,
    FlashcardSetModule,
    FlashcardModule,
    FlashcardBookmarkModule,
    FlashcardSetPermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleWare)
      .exclude(
        'auth/login',
        'auth/register',
        'auth/refresh',
        'auth/forgot-password',
        'auth/reset-password',
        'auth/forgot-password/reset',
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
