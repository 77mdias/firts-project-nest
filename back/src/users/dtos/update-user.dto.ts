import { IsEnum, IsOptional, IsString, IsBoolean } from "class-validator";
import { Role } from "@prisma/client";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
