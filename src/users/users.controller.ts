import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  InternalServerErrorException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from '../middlewares/check-auth-middleware';

import { UsersService } from './users.service';

//importing DTOs
import { UserCreateDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/login-user.dto';

type ResponseType = { error: { message: string } } | { message: string };
type LoginResponseType =
  | { error: { message: string } }
  | { message: string }
  | { accessToken: string; user: object };

interface Request {
  user: any;
}

@Controller('/api/auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // user register logic
  @Post('/register')
  async register(@Body() userCreateDto: UserCreateDto, @Res() res: Response) {
    try {
      const response: ResponseType = await this.usersService.register(
        userCreateDto,
      );

      if ('error' in response) {
        return res.status(400).json({
          message: response.error.message,
        });
      }

      return res.status(200).json({ message: response.message });
    } catch (e) {
      console.log('Catch for controller`s register, error:', e);
      throw new InternalServerErrorException();
    }
  }

  // user login logic
  @Post('/login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    try {
      const response: LoginResponseType = await this.usersService.login(body);

      if ('error' in response) {
        return res.status(400).json({ message: response.error.message });
      }

      return res.status(200).json(response);
    } catch (e) {
      console.log('Catch for controller`s login, error:', e);
      throw new InternalServerErrorException();
    }
  }

  // getting user data
  @UseGuards(AuthGuard)
  @Get('/get-user-data')
  async getUserData(@Req() req: Request, @Res() res: Response) {
    const response: LoginResponseType = await this.usersService.getUserData(
      req.user,
    );

    if ('error' in response) {
      return res.status(400).json({ message: response.error.message });
    }

    return res.status(200).json(response);
  }
}
