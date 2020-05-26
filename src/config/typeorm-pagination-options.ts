import { IsOptional, IsString } from 'class-validator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/index';

export class PaginationOptions implements IPaginationOptions {

  @IsString()
  @IsOptional()
  search: string = '';

  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;

}
