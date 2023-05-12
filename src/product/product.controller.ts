import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { createProductDto } from './dto/create-product.dto';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createProduct(
    @Body() createProductDto: createProductDto,
    @GetUser() user: User,
  ) {
    return this.productService.createProduct(createProductDto, user);
  }

  @Get()
  @UsePipes(ValidationPipe)
  async getProducts(@Query() filterProductDto: FilterProductDto) {
    return this.productService.findProducts(filterProductDto);
  }

  @Get('/:id')
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findProduct(id);
  }

  @Patch('/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productService.updateProduct(id, user, updateProductDto);
  }

  @Delete('/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.productService.deleteProduct(id, user);
  }
}
