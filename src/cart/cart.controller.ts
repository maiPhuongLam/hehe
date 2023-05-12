import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(@GetUser() user: User) {
    return this.cartService.fetchItemsInCart(user);
  }

  @Post('/:productId/add')
  async addItemToCart(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.addItemToCart(user, productId);
  }

  @Post('/:productId/remove')
  async removeItemToCart(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItemToCart(user, productId);
  }
}
