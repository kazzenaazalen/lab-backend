import { Body, Controller, Delete, Get, Post,Param,Put, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {CreateMahasiswaDTO } from './dto/create-Mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserDecorator } from './user.decorator';
import { AuthGuard } from './auth.guard';
import { User } from './entity/user.entity';
// import { User } from './entity/user.entity';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post("Mahasiswa")
  @ApiBody({type : CreateMahasiswaDTO})
  createMahasiswa(@Body()data : CreateMahasiswaDTO){
    return this.appService.addMahasiswa(data);
}
@Get("mahasiswa")
getmahasiswa() {
  return this.appService.getMahasiswa();
}

@Post("register")
@ApiBody({
  type : RegisterUserDto})
register(@Body() user : RegisterUserDto) {
  return this.appService.register(user)
}

@Get("/auth")
@UseGuards(AuthGuard)
@ApiBearerAuth()
auth(@UserDecorator() user : User) {
 return user
}


@Post("login")
@ApiBody({ 
  type : RegisterUserDto
})
async login( @Body() data : RegisterUserDto, 
@Res({passthrough : true}) res : Response ) {
  const result = await this.appService.login(data)
  res.cookie("token", result.token)

  // result.user = plainToInstance(User, result.user)

  return result
}


//DELETE localhost:3000/mahasiswa/105841104922
 @Delete("mahasiswa/:nim")
 deletMahasiswa(@Param("nim")nim : string){
  return this.appService.deleteMahasiswa(nim);
 }


  @Put("mahasiswa/:nim")
  @ApiBody({ type : UpdateMahasiswaDto})
  editMahasiswa(
     @Param("nim") nim : string, @Body() { nama }: UpdateMahasiswaDto
    ) {
      return this.appService.UpdteMahasiswa(nim,nama);
     
  }


  @Get("mahasiswa/:nim")
  getMahasiswaByNim(@Param("nim") nim : string){
    return this.appService.getMahasiswaByNIM(nim);
  }
  
}

