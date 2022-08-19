import { IsString, IsNumber, Max, Min } from 'class-validator';
export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5, { message: 'Rating should be 5 or lower' })
  @Min(1, { message: 'Rating should be 1 or higher' })
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}
