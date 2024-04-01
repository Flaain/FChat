import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signup() {}

  @Post('signin')
  signin() {}

  @Get('me')
  me(@Body() token: string, @Res() res: Response) {
    res.status(HttpStatus.OK).json({
      id: 'window.crypto.randomUUID()',
      username: 'User',
      email: 'g7yJt@example.com',
      conversations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      token
    });
  }
}