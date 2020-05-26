import { IsOptional, IsString } from 'class-validator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/index';

export class PaginationOptions implements IPaginationOptions {

  @IsString()
  @IsOptional()
  search: string = '';

  @IsOptional()
  limit: number = 10;

  @IsOptional()
  page: number = 1;

}
