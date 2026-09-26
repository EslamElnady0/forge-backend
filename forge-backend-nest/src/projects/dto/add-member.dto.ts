import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AddMemberDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
}
