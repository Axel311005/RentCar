import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@ApiTags('Pagos')
@Controller('pagos')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @ApiOperation({ summary: 'Crear un pago' })
  @ApiBody({ type: CreatePagoDto })
  @ApiCreatedResponse({ description: 'Pago creado correctamente.' })
  @Post()
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(createPagoDto);
  }

  @ApiOperation({ summary: 'Listar todos los pagos' })
  @ApiOkResponse({ description: 'Lista de pagos obtenida correctamente.' })
  @Get()
  findAll() {
    return this.pagoService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un pago por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del pago' })
  @ApiOkResponse({ description: 'Pago encontrado.' })
  @ApiNotFoundResponse({ description: 'Pago no encontrado.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.pagoService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un pago por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del pago' })
  @ApiBody({ type: UpdatePagoDto })
  @ApiOkResponse({ description: 'Pago actualizado correctamente.' })
  @ApiNotFoundResponse({ description: 'Pago no encontrado.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePagoDto: UpdatePagoDto,
  ) {
    return this.pagoService.update(id, updatePagoDto);
  }

  @ApiOperation({ summary: 'Eliminar un pago por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del pago' })
  @ApiNoContentResponse({ description: 'Pago eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Pago no encontrado.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.pagoService.remove(id);
  }
}
