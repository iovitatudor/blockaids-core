import { ApiProperty } from '@nestjs/swagger';

export class ServiceUpdateDto {
  @ApiProperty({ example: '1' })
  langId: number;

  @ApiProperty({ example: 'Trading', required: false })
  name: string;

  @ApiProperty({ example: 'Service Description', required: false })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public video: string;

  @ApiProperty({ example: '20', required: false })
  price: number;

  @ApiProperty({ example: 'service-10', required: false })
  hash: string;
}
