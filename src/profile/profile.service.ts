import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { extname } from 'path';
import prisma from 'src/prisma';

@Injectable()
export class ProfileService {
    
    async uploadFile(file: Express.Multer.File, user_id : number)
    {
        const user = await prisma.user.findFirst({
            where : {
                id : user_id
            }
        })

        if(user == null) throw new NotFoundException("Tidak Menemukan User")
        if(user.foto_profil != null) {
           const filePath = `../../upload/${user.foto_profil}`;
           if(existsSync(filePath)) {
            rmSync(filePath)
           }

        }

        const uploadPath = `../../upload`;
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
        }

        const fileExt = extname (file.originalname);
        const baseFilename = user.username;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
        const filePath = `${uploadPath}/${filename}`;

        writeFileSync (filePath, file.buffer);
        await prisma.user.update({
            where : {
                id : user_id
            },
            data : {
                foto_profil : filename
            }
        })

        return {filename, path : filePath};

    }

    async sendMyFotoProfile(user_id : number)
    {
        const user = await prisma.user.findFirst({
            where : {
                id : user_id
            }
        })

        if(user == null) throw new NotFoundException("Tidak Menemukan User")
        return user.foto_profil
    }
}

