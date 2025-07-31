import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { QueryCategoriesDto } from '../dto/query-categories.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { Category } from '../entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully',
    type: Category,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category with this slug already exists',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories retrieved successfully',
  })
  async findAll(@Query() queryDto: QueryCategoriesDto) {
    return await this.categoriesService.findAll(queryDto);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree structure' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category tree retrieved successfully',
    type: [Category],
  })
  async getTree(): Promise<Category[]> {
    return await this.categoriesService.getTree();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Featured categories retrieved successfully',
    type: [Category],
  })
  async getFeatured(): Promise<Category[]> {
    return await this.categoriesService.getFeaturedCategories();
  }

  @Get('root')
  @ApiOperation({ summary: 'Get root categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Root categories retrieved successfully',
    type: [Category],
  })
  async getRoot(): Promise<Category[]> {
    return await this.categoriesService.getRootCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    description: 'Include related data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category retrieved successfully',
    type: Category,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations?: boolean,
  ): Promise<Category> {
    return await this.categoriesService.findOne(id, includeRelations);
  }

  @Get(':id/subcategories')
  @ApiOperation({ summary: 'Get subcategories of a category' })
  @ApiParam({ name: 'id', description: 'Parent category ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subcategories retrieved successfully',
    type: [Category],
  })
  async getSubcategories(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Category[]> {
    return await this.categoriesService.getSubcategories(id);
  }

  @Get(':id/path')
  @ApiOperation({ summary: 'Get category path from root to category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category path retrieved successfully',
    type: [Category],
  })
  async getCategoryPath(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Category[]> {
    return await this.categoriesService.getCategoryPath(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or circular reference',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete category with subcategories or products',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.categoriesService.remove(id);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload category image' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image uploaded successfully',
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // TODO: Implement image upload logic (local storage or cloud)
    // For now, return a placeholder response
    return {
      message: 'Image upload endpoint - implementation needed',
      filename: file?.originalname,
      size: file?.size,
    };
  }
}