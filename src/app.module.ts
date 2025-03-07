import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth.module';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


console.log(AppController)
@Module({
  imports: [
    JwtModule.register({
      secret: "helloword",
      global : true 
    }),
    AuthModule,
    ProfileModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
