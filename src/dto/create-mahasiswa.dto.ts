import { ApiProperty } from '@nestjs/swagger';
import { Jenis_Kelamin } from '@prisma/client';
import { IsString, IsNotEmpty, Length, IsEnum } from 'class-validator';


export class CreateMahasiswaDTO {
  @ApiProperty({
    description: 'NIM',
    type: String,
    example: '105841107122',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 12)
  nim: string;

  @ApiProperty({
    description: 'Nama',
    type: String,
    example: 'Zalna Nur Islamiah',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nama: string;

  @ApiProperty({
    description: 'Kelas',
    type: String,
    example: '5B',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  kelas: string;

  @ApiProperty({
    description: 'Jurusan',
    type: String,
    example: 'Informatika',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  jurusan: string;

  @ApiProperty({
    description: 'Jenis Kelamin',
    enum : Jenis_Kelamin,
    example: 'P',
  })
  @IsEnum(Jenis_Kelamin)
  jenis_kelamin: Jenis_Kelamin;
}