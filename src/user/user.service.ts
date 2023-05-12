import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Cart } from 'src/cart/cart.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(email: string, password: string, cartId: string) {
    const user = await new User();
    user.email = email;
    user.password = password;
    user.cartId = cartId;
    await user.save();
    return user;
  }

  async updateCartId(userId: number, cartId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.cartId = cartId;
    await user.save();
    return user;
  }
}
