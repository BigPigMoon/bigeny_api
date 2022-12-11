import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ description: 'user name for update'})
    @IsString()
    @IsNotEmpty()
    nickname: string;
}