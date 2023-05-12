import { Cart } from 'src/cart/cart.entity';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  totalPrice: number;

  @ManyToOne((type) => Cart, (cart) => cart.order)
  cart: Cart;

  @Column()
  cartId: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
