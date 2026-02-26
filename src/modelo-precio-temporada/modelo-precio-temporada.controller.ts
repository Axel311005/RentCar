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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ModeloPrecioTemporadaService } from './modelo-precio-temporada.service';
import { CreateModeloPrecioTemporadaDto } from './dto/create-modelo-precio-temporada.dto';
import { UpdateModeloPrecioTemporadaDto } from './dto/update-modelo-precio-temporada.dto';

@ApiTags('Modelos-Precios-Temporadas')
@Controller('modelos-precios-temporadas')
export class ModeloPrecioTemporadaController {
  constructor(
    private readonly modeloPrecioTemporadaService: ModeloPrecioTemporadaService,
  ) {}

  @ApiOperation({ summary: 'Crear precio de temporada para un modelo' })
  @ApiBody({ type: CreateModeloPrecioTemporadaDto })
  @ApiCreatedResponse({
    description: 'Precio de temporada creado correctamente.',
  })
  @Post()
  create(@Body() createDto: CreateModeloPrecioTemporadaDto) {
    return this.modeloPrecioTemporadaService.create(createDto);
  }

  @ApiOperation({ summary: 'Listar precios de temporada por modelo' })
  @ApiOkResponse({
    description: 'Lista de precios de temporada obtenida correctamente.',
  })
  @Get()
  findAll() {
    return this.modeloPrecioTemporadaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener precio de temporada por id' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'UUID del precio de temporada de modelo',
  })
  @ApiOkResponse({ description: 'Precio de temporada encontrado.' })
  @ApiNotFoundResponse({ description: 'Precio de temporada no encontrado.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.modeloPrecioTemporadaService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar precio de temporada por id' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'UUID del precio de temporada de modelo',
  })
  @ApiBody({ type: UpdateModeloPrecioTemporadaDto })
  @ApiOkResponse({
    description: 'Precio de temporada actualizado correctamente.',
  })
  @ApiNotFoundResponse({ description: 'Precio de temporada no encontrado.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateModeloPrecioTemporadaDto,
  ) {
    return this.modeloPrecioTemporadaService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Eliminar precio de temporada por id' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'UUID del precio de temporada de modelo',
  })
  @ApiOkResponse({
    description: 'Precio de temporada eliminado correctamente.',
  })
  @ApiNotFoundResponse({ description: 'Precio de temporada no encontrado.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.modeloPrecioTemporadaService.remove(id);
  }
}
