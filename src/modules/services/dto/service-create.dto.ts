import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceCreateDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  expert_id: number;

  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  lang_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Trading' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'Service Description', required: false })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public video: string;

  @ApiProperty({ example: 20, required: false})
  price: number;

  @ApiProperty({ example: 'service-10', required: false })
  hash: string;
}
