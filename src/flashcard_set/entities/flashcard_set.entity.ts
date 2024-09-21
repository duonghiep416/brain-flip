import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Flashcard } from 'src/flashcard/entities/flashcard.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'flashcard_sets',
})
export class FlashcardSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsString()
  description: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  @IsBoolean()
  is_private: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.flashcard_sets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Flashcard, (flashcard) => flashcard.flashcard_sets)
  flashcards: Flashcard[];
}
