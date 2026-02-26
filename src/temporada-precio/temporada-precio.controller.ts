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
import { TemporadaPrecioService } from './temporada-precio.service';
import { CreateTemporadaPrecioDto } from './dto/create-temporada-precio.dto';
import { UpdateTemporadaPrecioDto } from './dto/update-temporada-precio.dto';

@ApiTags('Temporadas-Precios')
@Controller('temporadas-precios')
export class TemporadaPrecioController {
  constructor(
    private readonly temporadaPrecioService: TemporadaPrecioService,
  ) {}

  @ApiOperation({ summary: 'Crear una temporada de precio' })
  @ApiBody({ type: CreateTemporadaPrecioDto })
  @ApiCreatedResponse({ description: 'Temporada creada correctamente.' })
  @Post()
  create(@Body() createTemporadaPrecioDto: CreateTemporadaPrecioDto) {
    return this.temporadaPrecioService.create(createTemporadaPrecioDto);
  }

  @ApiOperation({ summary: 'Listar todas las temporadas de precio' })
  @ApiOkResponse({
    description: 'Lista de temporadas de precio obtenida correctamente.',
  })
  @Get()
  findAll() {
    return this.temporadaPrecioService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una temporada de precio por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la temporada' })
  @ApiOkResponse({ description: 'Temporada encontrada.' })
  @ApiNotFoundResponse({ description: 'Temporada no encontrada.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.temporadaPrecioService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una temporada de precio por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la temporada' })
  @ApiBody({ type: UpdateTemporadaPrecioDto })
  @ApiOkResponse({ description: 'Temporada actualizada correctamente.' })
  @ApiNotFoundResponse({ description: 'Temporada no encontrada.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTemporadaPrecioDto: UpdateTemporadaPrecioDto,
  ) {
    return this.temporadaPrecioService.update(id, updateTemporadaPrecioDto);
  }

  @ApiOperation({ summary: 'Eliminar una temporada de precio por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la temporada' })
  @ApiOkResponse({ description: 'Temporada eliminada correctamente.' })
  @ApiNotFoundResponse({ description: 'Temporada no encontrada.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.temporadaPrecioService.remove(id);
  }
}
