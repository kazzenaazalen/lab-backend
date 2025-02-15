import { BadRequestException, Controller, Get, Param, Post, Query, Res, Search, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { UserDecorator } from 'src/user.decorator';
import { user } from '@prisma/client';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @UserDecorator() user : user) {
    if (file == null) throw new BadRequestException("File Tidak Boleh Kosong");
    return this.profileService.uploadFile(file, user.id);
  }

  @Get("serach")
  async getName(
    @Query('search') Search : string,
  ) {
    return Search
  }

  @Get("/:id")
  async getProfile(@Param("id") id : number, @Res() res : Response){
    const filename = await this.profileService.sendMyFotoProfile(id)
    return res.sendFile('../../upload/' + filename)
  }

  

  }