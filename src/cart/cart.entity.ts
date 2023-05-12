import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Order } from 'src/order/order.entity';

@Entity()
export class Cart extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne((type) => User, (user) => user.cart)
  user: User;

  @Column()
  userId: number;

  @OneToMany((type) => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  @OneToOne((type) => Order, (order) => order.cart)
  order: Order;

  @Column({ nullable: true })
  orderId: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
