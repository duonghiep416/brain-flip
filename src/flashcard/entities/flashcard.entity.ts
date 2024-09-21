import { IsNotEmpty } from 'class-validator';
import { FlashcardSet } from 'src/flashcard_set/entities/flashcard_set.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'flashcards',
})
export class Flashcard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FlashcardSet, (flashcardSet) => flashcardSet.flashcards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'flashcard_set_id' })
  flashcard_sets: FlashcardSet;

  @Column()
  @IsNotEmpty()
  term: string;

  @Column()
  @IsNotEmpty()
  definition: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
