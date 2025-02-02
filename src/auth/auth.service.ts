import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up-dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.getUserByEmail(signInDto.email, true);
    if (!user) return null;

    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) return null;

    const payload = { username: user.name, sub: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const userFound = await this.userService.getUserByEmail(signUpDto.email);
    if (userFound) throw new HttpException('Email Already Exist', 400);

    return this.userService.createUser(signUpDto);
  }
}
