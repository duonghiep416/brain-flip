import * as bcrypt from 'bcrypt';

export class PasswordService {
  private static readonly saltRounds = 10;

  // Hàm hash mật khẩu
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  // Hàm so sánh mật khẩu với hash đã lưu
  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
