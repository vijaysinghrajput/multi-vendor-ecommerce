import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, Not } from 'typeorm';
import { Category, CommissionType } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { QueryCategoriesDto } from '../dto/query-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, slug, parentId, ...rest } = createCategoryDto;

    // Generate slug if not provided
    const categorySlug = slug || this.generateSlug(name);

    // Check if slug already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { slug: categorySlug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    // Validate parent category if provided
    let parentCategory: Category | null = null;
    let level = 1;

    if (parentId) {
      parentCategory = await this.categoryRepository.findOne({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }

      level = parentCategory.level + 1;

      // Prevent circular references
      if (await this.wouldCreateCircularReference(parentId, null)) {
        throw new BadRequestException('Cannot create circular reference');
      }
    }

    const category = this.categoryRepository.create({
      name,
      slug: categorySlug,
      parentId,
      level,
      ...rest,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(queryDto: QueryCategoriesDto) {
    const {
      page,
      limit,
      search,
      status,
      parentId,
      level,
      commissionType,
      isFeatured,
      isActive,
      sortBy,
      sortOrder,
      includeChildren,
      includeParent,
    } = queryDto;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('category.isActive = :status', { status });
    }

    if (parentId !== undefined) {
      if (parentId === null || parentId === '') {
        queryBuilder.andWhere('category.parentId IS NULL');
      } else {
        queryBuilder.andWhere('category.parentId = :parentId', { parentId });
      }
    }

    if (level) {
      queryBuilder.andWhere('category.level = :level', { level });
    }

    if (commissionType) {
      queryBuilder.andWhere('category.commissionType = :commissionType', {
        commissionType,
      });
    }

    if (isFeatured !== undefined) {
      queryBuilder.andWhere('category.isFeatured = :isFeatured', {
        isFeatured,
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('category.isActive = :isActive', { isActive });
    }

    // Include relations
    if (includeChildren) {
      queryBuilder.leftJoinAndSelect('category.children', 'children');
    }

    if (includeParent) {
      queryBuilder.leftJoinAndSelect('category.parent', 'parent');
    }

    // Apply sorting
    queryBuilder.orderBy(`category.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [categories, total] = await queryBuilder.getManyAndCount();

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, includeRelations = false): Promise<Category> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    queryBuilder.where('category.id = :id', { id });

    if (includeRelations) {
      queryBuilder
        .leftJoinAndSelect('category.children', 'children')
        .leftJoinAndSelect('category.parent', 'parent')
        .leftJoinAndSelect('category.products', 'products');
    }

    const category = await queryBuilder.getOne();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    const { slug, parentId, ...rest } = updateCategoryDto;

    // Check slug uniqueness if provided
    if (slug && slug !== category.slug) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug, id: Not(id) },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Handle parent change
    if (parentId !== undefined && parentId !== category.parentId) {
      if (parentId) {
        // Validate new parent exists
        const parentCategory = await this.categoryRepository.findOne({
          where: { id: parentId },
        });

        if (!parentCategory) {
          throw new NotFoundException('Parent category not found');
        }

        // Prevent circular references
        if (await this.wouldCreateCircularReference(parentId, id)) {
          throw new BadRequestException('Cannot create circular reference');
        }

        // Update level
        await this.updateCategoryLevel(id, parentCategory.level + 1);
      } else {
        // Moving to root level
        await this.updateCategoryLevel(id, 1);
      }
    }

    // Update category
    Object.assign(category, { slug, parentId, ...rest });
    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id, true);

    // Check if category has children
    if (category.children && category.children.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with subcategories. Please delete or move subcategories first.',
      );
    }

    // Check if category has products
    if (category.products && category.products.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with products. Please move or delete products first.',
      );
    }

    await this.categoryRepository.remove(category);
  }

  async getTree(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: { isActive: true },
      order: { level: 'ASC', sortOrder: 'ASC' },
    });

    return this.buildTree(categories);
  }

  async getFeaturedCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { isFeatured: true, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getRootCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { parentId: IsNull(), isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getSubcategories(parentId: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { parentId, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getCategoryPath(categoryId: string): Promise<Category[]> {
    const category = await this.findOne(categoryId);
    const path: Category[] = [category];

    let currentCategory = category;
    while (currentCategory.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: currentCategory.parentId },
      });
      if (parent) {
        path.unshift(parent);
        currentCategory = parent;
      } else {
        break;
      }
    }

    return path;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async wouldCreateCircularReference(
    parentId: string,
    categoryId: string | null,
  ): Promise<boolean> {
    if (!categoryId) return false;

    let currentParentId = parentId;
    while (currentParentId) {
      if (currentParentId === categoryId) {
        return true;
      }

      const parent = await this.categoryRepository.findOne({
        where: { id: currentParentId },
      });

      currentParentId = parent?.parentId || null;
    }

    return false;
  }

  private async updateCategoryLevel(categoryId: string, newLevel: number): Promise<void> {
    // Update the category level
    await this.categoryRepository.update(categoryId, { level: newLevel });

    // Update all descendants
    const children = await this.categoryRepository.find({
      where: { parentId: categoryId },
    });

    for (const child of children) {
      await this.updateCategoryLevel(child.id, newLevel + 1);
    }
  }

  private buildTree(categories: Category[]): Category[] {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // Create a map of all categories
    categories.forEach(category => {
      const categoryWithChildren = Object.assign(Object.create(Object.getPrototypeOf(category)), category);
      categoryWithChildren.children = [];
      categoryMap.set(category.id, categoryWithChildren);
    });

    // Build the tree structure
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;

      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  }
}