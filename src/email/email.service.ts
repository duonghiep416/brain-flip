import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ) {
    try {
      await this.mailerService.sendMail({
        to, // Địa chỉ email nhận
        subject, // Tiêu đề email
        template, // Template email (không cần đuôi .hbs)
        context, // Biến được truyền vào template
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
}
