import { Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/create')
  async createOrder(@GetUser() user: User) {
    return this.orderService.createOrder(user);
  }
}
