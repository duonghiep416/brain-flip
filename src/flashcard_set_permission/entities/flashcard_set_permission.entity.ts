import { FlashcardSet } from 'src/flashcard_set/entities/flashcard_set.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'flashcard_set_permissions',
})
export class FlashcardSetPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  permission_type: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => FlashcardSet, (flashcardSet) => flashcardSet.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'flashcard_set_id' })
  flashcard_set: FlashcardSet;
}
