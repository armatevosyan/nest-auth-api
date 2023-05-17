import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm/repository/Repository';
import { genSalt, hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserLoginDto } from './dto/login-user.dto';
import { UserCreateDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtTokenService: JwtService,
  ) {}

  async register(userCreateDto: UserCreateDto) {
    const existingUser: User = await this.userRepository.findOne({
      where: {
        username: userCreateDto.username,
      },
    });

    if (existingUser) {
      return {
        error: {
          message: 'User already registered with the same username.',
        },
      };
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(userCreateDto.password, salt);

    const newUser: User = this.userRepository.create({
      ...userCreateDto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return {
      message: 'User registration process is finished successfully.',
    };
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: userLoginDto.username,
      },
    });

    if (!user) {
      return {
        error: {
          message: 'User not found',
        },
      };
    }

    const decodedPassword = await compare(userLoginDto.password, user.password);

    if (!decodedPassword) {
      return {
        error: {
          message: 'Failed login attempt: Invalid password.',
        },
      };
    }

    const payload = {
      username: user.username,
      sub: user.id,
    };

    return {
      user: _.omit(user, ['password']),
      accessToken: this.jwtTokenService.sign(payload),
    };
  }

  async getUserData(user) {
    const userData: User = await this.userRepository.findOne({
      where: {
        username: user.username,
        id: user.sub,
      },
    });

    if (!userData) {
      return {
        error: {
          message: 'User not found',
        },
      };
    }

    return {
      message: 'Success',
      data: _.omit(userData, ['password']),
    };
  }
}
