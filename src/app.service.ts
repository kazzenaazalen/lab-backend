import {  BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {CreateMahasiswaDTO } from './dto/create-mahasiswa.dto';
import prisma from './prisma';
import { RegisterUserDto } from './dto/register-user.dto';
import { hash } from 'crypto';
import { compare, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import  PrismaService from './prisma';
import { User } from './entity/user.entity';
import { extname, join } from 'path';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';


@Injectable()
export class AppService {

  constructor(private readonly jwtService: JwtService,) {

  }

  async cariMahasiswa(filters: { nama?: string }) {
    const where: any = {};

    if (filters.nama) {
      where.nama = { contains: filters.nama };
    }
    return await prisma.mahasiswa.findMany({where});
}

  async uploadMahasiswaFoto(file: Express.Multer.File, nim : string)
  {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim
      }
    })

    if(!mahasiswa) throw new NotFoundException("Mahasiswa Tidak Ditemukan")

    if(mahasiswa.foto_profil) {
      const filePath = `../upload/${mahasiswa.foto_profil}`;
      if(existsSync(filePath)) {
        rmSync(filePath)
      }
    }

    const uploadPath = join (__dirname, '..', 'upload');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }

    const fileExt = extname (file.originalname);
    const baseFilename = mahasiswa.nim;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
    const filePath = `${uploadPath}/${filename}`;

    writeFileSync (filePath, file.buffer);
    await prisma.mahasiswa.update({
      where : {
        nim
      },
      data : {
        foto_profil : filename
      },
    })

    return {filename, path : filePath};

  }

  async getMahasiswaFoto(nim : string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim
      }
    })

    if(!mahasiswa) throw new NotFoundException("Mahasiswa Tidak Ditemukan")

    return mahasiswa.foto_profil;
  }

  async login(data : RegisterUserDto){
    try {
      const user = await prisma.user.findFirst({
        where : {
          username : data.username
        }
      })

      if(user == null) throw new NotFoundException("Username Tidak Ditemukan")

      if(!compare(data.password, user.password)) throw new BadRequestException("Password Salah")

      const payload = {
        id: user.id,
        username : user.username,
        role : user.role
      }

      const token = await this.jwtService.signAsync(payload)

      return {
        token : token,
        user : payload
      }

    } catch (err) {
      throw new InternalServerErrorException("Ada Masalah Pada Server")
    }
  }

  async register(data : RegisterUserDto){
    try {
      const user = await prisma.user.findFirst({
        where : {
          username : data.username
        }
      })
      if (user !=null) throw new BadRequestException("Username Sudah Ada")

        const hash = hashSync(data.password, 10)

        const newUser = await prisma.user.create({
          data : {
            username : data.username,
            password : hash,
            role : "user"
          }
        })

        return newUser
    } catch (err) {
      throw new InternalServerErrorException("Ada Masalah Pada Server")

    }
  } 

  async auth(user_id : number) {
    try {
    const user = await prisma.user.findFirst({
    where : {
    id : user_id
    }
     })
    if(user == null) throw new NotFoundException("User Tidak Ditemukan")
     return user
     }catch(err) {
    if(err instanceof HttpException) throw err
    throw new InternalServerErrorException("Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit")
     }
     }
  

  async getMahasiswa() {
    return await prisma.mahasiswa.findMany();
  }

  async getMahasiswaByNIM(nim : string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim
      }
    })

    if(mahasiswa == null) 
      throw new NotFoundException("Tidak Menemukan NIM")

    return mahasiswa

  }

  async addMahasiswa(data : CreateMahasiswaDTO) {
    await prisma.mahasiswa.create({ data
    })

    return await prisma.mahasiswa.findMany()
  }

  async deleteMahasiswa(nim : string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim 
      }
    })

    if(mahasiswa == null) {
      throw new NotFoundException("Tidak Menemukan NIM")
    }

    await prisma.mahasiswa.delete({
      where : {
        nim 
      }
    })

    return await prisma.mahasiswa.findMany()
  }

  async UpdteMahasiswa(nim : string, nama : string) { 
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim 
      }
    })

    if(mahasiswa == null) {
      throw new NotFoundException("Tidak Menemukan NIM")
    }

    await prisma.mahasiswa.update({
      where : {
        nim 
      },
      data : {
        nama
      }
    })

    return await prisma.mahasiswa.findMany()
  }

  
}