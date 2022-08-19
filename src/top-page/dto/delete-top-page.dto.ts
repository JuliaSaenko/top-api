import { IsString } from 'class-validator';

export class DeleteTopPageDto {
  @IsString()
  _id: string;
}
