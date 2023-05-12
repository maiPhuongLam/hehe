import { Cart } from 'src/cart/cart.entity';
import { Order } from 'src/order/order.entity';
import { Product } from 'src/product/product.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany((type) => Product, (product) => product.user)
  products: Product[];

  @OneToOne((type) => Cart, (cart) => cart.user)
  cart: Cart;

  @Column()
  cartId: string;

  // @OneToMany((type) => Order, (order) => order.car)
  // orders: Order[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
