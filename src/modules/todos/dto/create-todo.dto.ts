import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  isCompleted: boolean;

  @IsString()
  @IsOptional()
  dueDate: Date;
}
