import { permission } from 'process';
import { UserRole } from 'src/common/enums/user-role.enum';
import { FlashcardBookmark } from 'src/flashcard_bookmark/entities/flashcard_bookmark.entity';
import { FlashcardSet } from 'src/flashcard_set/entities/flashcard_set.entity';
import { FlashcardSetPermission } from 'src/flashcard_set_permission/entities/flashcard_set_permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserRole.USER })
  role: number;

  @Column({ type: 'timestamptz', nullable: true })
  last_login: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => FlashcardSet, (flashcardSet) => flashcardSet.user)
  flashcard_sets: FlashcardSet[];

  @OneToMany(
    () => FlashcardBookmark,
    (flashcardBookmark) => flashcardBookmark.user,
  )
  bookmarks: FlashcardBookmark[];

  @OneToMany(() => FlashcardSetPermission, (permission) => permission.user)
  permissions: FlashcardSetPermission[];
}
