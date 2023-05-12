import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: '200ty',
      signOptions: { expiresIn: '3600s' },
    }),
    UserModule,
    CartModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
