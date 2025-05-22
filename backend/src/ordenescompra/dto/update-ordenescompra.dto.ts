import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdenescompraDto } from './create-ordenescompra.dto';

export class UpdateOrdenescompraDto extends PartialType(CreateOrdenescompraDto) {}
