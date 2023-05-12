import { Product } from 'src/product/product.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Product, (product) => product.cartItems)
  product: Product;

  @ManyToOne((type) => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @Column()
  productId: number;

  @Column()
  cartId: string;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
