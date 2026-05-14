import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

/** Pro sends `username` + `password` for account tab, or `mobile` + `captcha` for mobile tab. */
export class LoginAccountDto {
  @IsOptional()
  @IsString()
  type?: string;

  @ValidateIf((o) => o.type !== 'mobile')
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  username?: string;

  @ValidateIf((o) => o.type !== 'mobile')
  @IsString()
  @MinLength(1)
  password?: string;

  @ValidateIf((o) => o.type === 'mobile')
  @IsString()
  @MinLength(1)
  mobile?: string;

  @ValidateIf((o) => o.type === 'mobile')
  @IsString()
  @MinLength(1)
  captcha?: string;
}
