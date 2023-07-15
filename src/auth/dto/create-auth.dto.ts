import { IsNotEmpty, IsString } from "class-validator";

export class UserInvite {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
}
