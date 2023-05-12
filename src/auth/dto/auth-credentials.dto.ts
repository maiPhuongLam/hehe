import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  // @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
  //   message: 'password to weak',
  // })
  password: string;
}
