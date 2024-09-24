import { Flashcard } from 'src/flashcard/entities/flashcard.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({
  name: 'flashcard_bookmarks',
})
@Unique(['user', 'flashcard']) // Đảm bảo mỗi người dùng chỉ đánh dấu một flashcard một lần
export class FlashcardBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Flashcard, (flashcard) => flashcard.bookmarks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'flashcard_id' })
  flashcard: Flashcard;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
