import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password.toString(), salt);
    createUserDto.password = hash;
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).populate('password');
  }
}
