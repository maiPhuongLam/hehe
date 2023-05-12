import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/user.entity';
import { CartService } from 'src/cart/cart.service';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import { Cart } from 'src/cart/cart.entity';
import { CartItem } from 'src/cart/cart-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderService: Repository<Order>,
    private cartService: CartService,
    private userService: UserService,
  ) {}

  async createOrder(user: User) {
    let result;
    const cartId = (await this.userService.findOne(user.email)).cartId;
    const cartItems = await this.cartService.fetchItemsInCart(user);
    const totalPrice = await cartItems.reduce((result, currentValue) => {
      return result + currentValue.product.price * currentValue.quantity;
    }, 0);
    const order = await new Order();
    order.id = uuidv4();
    order.totalPrice = totalPrice;
    order.cartId = cartId;
    await this.cartService.resetCart(user);
    await order.save();
    if (cartItems.length > 0) {
      const stripe = await new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: '2022-11-15',
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: cartItems.map((item) => {
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.product.name,
              },
              unit_amount: item.product.price,
            },
            quantity: item.quantity,
          };
        }),
        success_url: `${process.env.CLIENT_URL}/order/success`,
        cancel_url: `${process.env.CLIENT_URL}/order/cancel`,
      });
      return session.url;
    } else {
      throw new BadRequestException();
    }
  }
}
