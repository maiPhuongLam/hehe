import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private userService: UserService,
  ) {}

  async createCart(userId: number): Promise<Cart> {
    const cart = await new Cart();
    cart.id = uuidv4();
    cart.userId = userId;
    await cart.save();
    return cart;
  }

  async fetchItemsInCart(user: User): Promise<CartItem[]> {
    const cartId = (await this.userService.findOne(user.email)).cartId;
    const cartItems = await this.cartItemRepository.find({
      relations: { product: true },
      where: { cartId },
    });
    return cartItems;
  }

  async resetCart(user: User) {
    const cartId = (await this.userService.findOne(user.email)).cartId;
    const query = await this.cartItemRepository.createQueryBuilder('cartItem');
    return query
      .delete()
      .from(CartItem)
      .where('cartId = :cartId', { cartId })
      .execute();
  }

  async addItemToCart(user: User, productId: number): Promise<CartItem> {
    let cartItem: CartItem;
    const cartId = (await this.userService.findOne(user.email)).cartId;
    cartItem = await this.cartItemRepository.findOne({
      where: { cartId, productId },
    });
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      const cartId = (await this.userService.findOne(user.email)).cartId;
      cartItem = await new CartItem();
      cartItem.quantity = 1;
      cartItem.cartId = cartId;
      cartItem.productId = productId;
    }
    await cartItem.save();
    return cartItem;
  }

  async removeItemToCart(user: User, productId: number): Promise<any> {
    let result;
    const cartId = (await this.userService.findOne(user.email)).cartId;
    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId, productId },
    });
    if (cartItem) {
      if (cartItem.quantity >= 2) {
        cartItem.quantity -= 1;
        result = await cartItem.save();
      } else {
        result = await this.cartItemRepository.remove(cartItem);
      }
    } else {
      throw new NotFoundException('CartItem not exist');
    }
    return result;
  }
}
