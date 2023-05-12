import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository, UpdateResult } from 'typeorm';
import { createProductDto } from './dto/create-product.dto';
import { User } from 'src/user/user.entity';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async createProduct(
    createProductDto: createProductDto,
    user: User,
  ): Promise<Product> {
    const { name, price } = createProductDto;
    const product = await new Product();
    product.name = name;
    product.price = price;
    product.userId = user.id;
    await product.save();
    return product;
  }

  async findProducts(filterProductDto: FilterProductDto): Promise<Product[]> {
    const perPage = 3 as number;
    const { page, name, userId } = filterProductDto;
    const query = await this.productRepository.createQueryBuilder('product');
    if (userId) {
      query.where('product.userId = :userId', { userId });
    }
    if (name) {
      query.andWhere('product.name LIKE :name ', { name: `%${name}%` });
    }
    if (page) {
      query.offset(perPage * (page - 1)).limit(perPage);
    } else {
      query.limit(perPage);
    }
    const products = await query.getMany();
    return products;
  }

  async findProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(
    id: number,
    user: User,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    const { name, price } = updateProductDto;
    const product = await this.findProduct(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.userId !== user.id) {
      throw new UnauthorizedException();
    }
    const result = await this.productRepository.update(id, { name, price });
    return result;
  }

  async deleteProduct(id: number, user: User): Promise<Product> {
    const product = await this.findProduct(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.userId !== user.id) {
      throw new UnauthorizedException();
    }
    await this.productRepository.delete(id);
    return product;
  }
}
