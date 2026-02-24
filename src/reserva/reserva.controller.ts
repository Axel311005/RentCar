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
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@ApiTags('Reservas')
@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @ApiOperation({ summary: 'Crear una reserva' })
  @ApiBody({ type: CreateReservaDto })
  @ApiCreatedResponse({ description: 'Reserva creada correctamente.' })
  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.create(createReservaDto);
  }

  @ApiOperation({ summary: 'Listar todas las reservas' })
  @ApiOkResponse({ description: 'Lista de reservas obtenida correctamente.' })
  @Get()
  findAll() {
    return this.reservaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una reserva por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la reserva' })
  @ApiOkResponse({ description: 'Reserva encontrada.' })
  @ApiNotFoundResponse({ description: 'Reserva no encontrada.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reservaService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una reserva por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la reserva' })
  @ApiBody({ type: UpdateReservaDto })
  @ApiOkResponse({ description: 'Reserva actualizada correctamente.' })
  @ApiNotFoundResponse({ description: 'Reserva no encontrada.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    return this.reservaService.update(id, updateReservaDto);
  }

  @ApiOperation({ summary: 'Eliminar una reserva por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la reserva' })
  @ApiNoContentResponse({ description: 'Reserva eliminada correctamente.' })
  @ApiNotFoundResponse({ description: 'Reserva no encontrada.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reservaService.remove(id);
  }
}
