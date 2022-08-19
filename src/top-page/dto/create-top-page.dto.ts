import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TopLevelCategory } from '../top-page.model';

class VacanciesDataDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

class TopPageFeatureDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateTopPageDto {
  @IsEnum(TopLevelCategory)
  firstLevelCategory: TopLevelCategory;

  @IsString()
  secondLevelCategory: string;

  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => VacanciesDataDto)
  vacancies?: VacanciesDataDto;

  @IsArray()
  @ValidateNested()
  @Type(() => TopPageFeatureDto)
  features: TopPageFeatureDto[];

  @IsOptional()
  @IsString()
  tagsTitle?: string;

  @IsString()
  seoText: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
