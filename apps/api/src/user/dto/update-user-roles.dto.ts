import { ArrayUnique, IsArray, IsString } from 'class-validator';

export class UpdateUserRolesDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  roleIds!: string[];
}
