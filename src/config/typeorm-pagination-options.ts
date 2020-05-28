import { IsOptional, IsString } from 'class-validator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/index';

export class PaginationOptions implements IPaginationOptions {
  @IsString()
  @IsOptional()
  search = '';

  @IsOptional()
  limit = 10;

  @IsOptional()
  page = 1;
}
