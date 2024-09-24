import { TokenType } from 'src/common/enums/token-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'blacklist_tokens',
})
export class BlacklistToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  token: string;
  @Column({ default: TokenType.ACCESS })
  type: number;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
