import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlashcardSet } from 'src/flashcard_set/entities/flashcard_set.entity';
import { Flashcard } from 'src/flashcard/entities/flashcard.entity';
import { Request } from 'express';
import { TokenService } from 'src/shared/services/token.service';
import { User } from 'src/user/entities/user.entity';
import { omit } from 'lodash';
import { isUUID } from 'class-validator'; // Import hàm kiểm tra UUID
import { UpdateFlashcardSetDto } from 'src/flashcard_set/dto/update-flashcard_set.dto';
import { CreateFlashcardSetDto } from 'src/flashcard_set/dto/create-flashcard_set.dto';
import { PasswordService } from 'src/shared/services/password.service';
import { _ } from 'lodash';
import { UpdateFlashcardSetRoleDto } from 'src/flashcard_set/dto/update-flashcard-role.dto';
import { FlashcardSetPermission } from 'src/flashcard_set_permission/entities/flashcard_set_permission.entity';
import { FlashcardSetRole } from 'src/common/enums/flashcard-set-role.enum';
@Injectable()
export class FlashcardSetService {
  constructor(
    @InjectRepository(FlashcardSet)
    private readonly flashcardSetRepository: Repository<FlashcardSet>,
    @InjectRepository(Flashcard)
    private readonly flashcardRepository: Repository<Flashcard>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,

    @InjectRepository(FlashcardSetPermission)
    private readonly flashcardSetPermissionRepository: Repository<FlashcardSetPermission>,
  ) {}

  async create(createFlashcardSetDto: CreateFlashcardSetDto, req: Request) {
    const dataReq = this.tokenService.getDataFromToken(req);
    try {
      const userEntity = await this.userRepository.findOne({
        where: { id: dataReq.sub },
      });
      if (!userEntity) {
        throw new Error('User not found');
      }
      const flashcardSet = this.flashcardSetRepository.create({
        title: createFlashcardSetDto.title,
        description: createFlashcardSetDto?.description || '',
        user: userEntity,
      });

      const savedFlashcardSet =
        await this.flashcardSetRepository.save(flashcardSet);

      const flashcards = createFlashcardSetDto.flashcards.map((flashcard) => ({
        term: flashcard.term,
        definition: flashcard.definition,
        flashcard_sets: savedFlashcardSet,
      }));

      await this.flashcardRepository.save(flashcards);
      const res = {
        ...savedFlashcardSet,
        user_id: savedFlashcardSet.user.id,
      };
      return omit(res, ['password', 'user']);
    } catch (error) {
      console.error('Error creating flashcard set', error);
      throw new Error('Failed to create flashcard set');
    }
  }

  async findAll(query: any, req: Request) {
    const {
      q,
      is_private,
      min_created_at,
      max_created_at,
      user_id, // Thêm user_id vào tham số truy vấn
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'ASC',
    } = query;

    const { sub: currentUserId } = this.tokenService.getDataFromToken(req);

    const queryBuilder = this.flashcardSetRepository
      .createQueryBuilder('flashcard_set')
      .leftJoinAndSelect('flashcard_set.user', 'user');

    // Thêm điều kiện cho user_id nếu có
    if (user_id) {
      queryBuilder.andWhere('user.id = :userId', { userId: user_id });
      queryBuilder.andWhere('flashcard_set.is_private = :is_private', {
        is_private: false,
      });
    } else {
      // Nếu không có user_id, chỉ lấy flashcard của người dùng hiện tại
      queryBuilder.where('user.id = :userId', { userId: currentUserId });
    }

    // Thêm điều kiện cho is_private nếu có (nếu không phải từ user_id)
    if (is_private !== undefined && user_id === undefined) {
      queryBuilder.andWhere('flashcard_set.is_private = :is_private', {
        is_private: is_private === 'true',
      });
    }

    // Lọc theo khoảng created_at nếu có
    if (min_created_at && max_created_at) {
      queryBuilder.andWhere(
        'flashcard_set.created_at BETWEEN :min_created_at AND :max_created_at',
        {
          min_created_at: new Date(min_created_at),
          max_created_at: new Date(max_created_at),
        },
      );
    }

    // Tìm kiếm theo q (UUID, title, hoặc description)
    if (q) {
      if (isUUID(q)) {
        queryBuilder.andWhere('flashcard_set.id = :id', { id: q });
      } else {
        queryBuilder.andWhere(
          '(flashcard_set.title LIKE :q OR flashcard_set.description LIKE :q)',
          { q: `%${q}%` },
        );
      }
    }

    // Thêm sắp xếp (sort_by và sort_order)
    queryBuilder.orderBy(
      `flashcard_set.${sort_by}`,
      sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    );

    // Áp dụng phân trang
    const [flashcardSets, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const result = flashcardSets.map((set) => ({
      ...omit(set, ['password', 'user']),
      user_id: set.user.id,
    }));

    return {
      data: result,
      metadata: {
        limit: +limit,
        total,
        current_page: page,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, req: Request) {
    const { sub: currentUserId } = this.tokenService.getDataFromToken(req);
    // id là UUID
    if (!isUUID(id)) {
      return new NotFoundException('Flashcard set not found');
    }
    try {
      const flashcardSet = await this.flashcardSetRepository.findOne({
        where: { id },
        relations: ['flashcards', 'user', 'flashcards.bookmarks'],
      });

      if (!flashcardSet) {
        return new NotFoundException('Not Found');
      }

      if (currentUserId !== flashcardSet.user.id) {
        return new ForbiddenException(
          'You do not have permission to view this flashcard set',
        );
      }
      // Xử lý flashcards: Đặt `bookmarks` là `true` hoặc `false` dựa trên độ dài của mảng bookmarks
      const updatedFlashcards = _.map(flashcardSet.flashcards, (flashcard) => {
        return {
          ...flashcard,
          bookmarks: flashcard.bookmarks.length > 0,
        };
      });

      // Cập nhật flashcardSet với flashcards mới đã xử lý
      _.set(flashcardSet, 'flashcards', updatedFlashcards);
      return _.omit(flashcardSet, ['user']);
    } catch (error) {
      console.error('error', error);
    }
  }

  async update(
    id: string,
    updateFlashcardSetDto: UpdateFlashcardSetDto,
    req: Request,
  ) {
    const { sub: currentUserId } = this.tokenService.getDataFromToken(req);
    let updatedFlashcards = [];

    // Fetch the FlashcardSet with the permission filtered by the current user using QueryBuilder
    const flashcardSet = await this.flashcardSetRepository
      .createQueryBuilder('flashcardSet')
      .leftJoinAndSelect('flashcardSet.user', 'user')
      .leftJoinAndSelect(
        'flashcardSet.permissions',
        'permissions',
        'permissions.user_id = :currentUserId',
        { currentUserId },
      )
      .leftJoinAndSelect('flashcardSet.flashcards', 'flashcards')
      .where('flashcardSet.id = :id', { id })
      .getOne();

    if (!flashcardSet) {
      throw new NotFoundException('Flashcard set not found');
    }

    // Extract the user's permission
    const userPermission = flashcardSet.permissions?.[0]; // Should only be one result due to the filtered join

    // Check if the current user is the owner or has the appropriate permission to update
    const isOwner = flashcardSet.user.id === currentUserId;
    const hasPermissionToUpdate =
      userPermission &&
      userPermission.permission_type === FlashcardSetRole.EDITOR; // Or another edit-level permission

    if (!isOwner && !hasPermissionToUpdate) {
      throw new ForbiddenException(
        'You do not have permission to update this flashcard set',
      );
    }

    // Hash the password if provided
    if (updateFlashcardSetDto.password) {
      updateFlashcardSetDto.password = await PasswordService.hashPassword(
        updateFlashcardSetDto.password,
      );
    }

    // Merge the update DTO into the existing FlashcardSet
    const updatedFlashcardSet = this.flashcardSetRepository.merge(
      flashcardSet,
      updateFlashcardSetDto,
    );

    if (updateFlashcardSetDto?.flashcards !== undefined) {
      // Ensure old flashcards are deleted
      await this.flashcardRepository.delete({ flashcard_sets: flashcardSet });
    }

    // Handle updating flashcards if provided
    if (
      updateFlashcardSetDto.flashcards &&
      updateFlashcardSetDto.flashcards.length > 0
    ) {
      // Save the updated FlashcardSet entity
      const savedFlashcardSet =
        await this.flashcardSetRepository.save(updatedFlashcardSet);

      // Create new flashcards and associate them with the flashcard set
      const flashcards = updateFlashcardSetDto.flashcards.map((flashcard) => ({
        term: flashcard.term,
        definition: flashcard.definition,
        flashcard_sets: savedFlashcardSet,
      }));

      // Save the new flashcards to the repository
      updatedFlashcards = await this.flashcardRepository.save(flashcards);
    } else {
      // Save the updated FlashcardSet entity
      await this.flashcardSetRepository.save(updatedFlashcardSet);
    }

    return {
      permissions: userPermission?.permission_type || null,
      ...omit(updatedFlashcardSet, ['password', 'user', 'permissions']),
      flashcards: updatedFlashcards.map((flashcard) =>
        omit(flashcard, ['flashcard_sets']),
      ),
    };
  }

  async updateRole(
    id: string,
    updateFlashcardSetRoleDto: UpdateFlashcardSetRoleDto,
    req: Request,
  ) {
    const { sub: currentUserId } = this.tokenService.getDataFromToken(req);

    try {
      // Check if the flashcardSet exists
      const flashcardSet = await this.flashcardSetRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!flashcardSet) {
        throw new NotFoundException('Flashcard set not found');
      }

      // Ensure the current user has permission to update the role
      if (flashcardSet.user.id !== currentUserId) {
        throw new ForbiddenException(
          'You do not have permission to update this flashcard set role',
        );
      }

      // Find the flashcard set role for the given user
      let flashcardSetRole =
        await this.flashcardSetPermissionRepository.findOne({
          where: {
            user: { id: updateFlashcardSetRoleDto.user_id },
            flashcard_set: { id },
          },
          relations: ['user', 'flashcard_set'],
        });

      if (!flashcardSetRole) {
        // If the role does not exist, create a new permission
        flashcardSetRole = this.flashcardSetPermissionRepository.create({
          user: { id: updateFlashcardSetRoleDto.user_id } as User,
          flashcard_set: { id } as FlashcardSet,
          permission_type: updateFlashcardSetRoleDto.role,
        });
      } else {
        // If the role exists, update the permission type
        flashcardSetRole.permission_type = updateFlashcardSetRoleDto.role;
      }

      // Save the new or updated flashcard set role
      await this.flashcardSetPermissionRepository.save(flashcardSetRole);

      return {
        message: 'Flashcard set role successfully updated',
      };
    } catch (error) {
      console.error('Error updating flashcard set role', error);
      return new Error('Failed to update flashcard set role');
    }
  }

  async remove(id: string, req: Request) {
    const { sub: currentUserId } = this.tokenService.getDataFromToken(req);
    const flashcardSet = await this.flashcardSetRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!flashcardSet) {
      throw new NotFoundException('Flashcard set not found');
    }
    if (flashcardSet.user.id !== currentUserId) {
      throw new ForbiddenException(
        'You do not have permission to delete this flashcard set',
      );
    }
    await this.flashcardSetRepository.delete(id);
    return { message: 'Flashcard set successfully deleted' };
  }
}
