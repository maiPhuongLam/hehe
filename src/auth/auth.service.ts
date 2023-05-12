import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './JwtPayload.interface';
import { User } from 'src/user/user.entity';
import { CartService } from 'src/cart/cart.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private cartService: CartService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private async hashPass(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    console.log(password);
    return bcrypt.hash(password, salt);
  }

  private async validateUserPassword(
    passwordInput: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordInput, password);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const isEqualPassword = await this.validateUserPassword(
      password,
      user.password,
    );
    if (!isEqualPassword) {
      throw new BadRequestException('Password is wrong');
    }
    const payload: JwtPayload = { email: user.email, id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(email: string, password: string): Promise<User> {
    const userExist = await this.userService.findOne(email);
    if (userExist) {
      throw new ConflictException('Email already exist');
    }
    const hashedPassword = await this.hashPass(password);
    const user = await this.userService.create(email, hashedPassword, uuidv4());
    const cart = await this.cartService.createCart(user.id);
    await this.userService.updateCartId(user.id, cart.id);
    return user;
  }
}
