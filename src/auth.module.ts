import { Global, Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { JwtModule } from "@nestjs/jwt";

@Global()
@Module({
    imports: [
    ],
    providers: [AppService],
    exports: [AppService]
})
export class AuthModule {
}
