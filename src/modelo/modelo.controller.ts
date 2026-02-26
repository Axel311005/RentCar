import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ModeloService } from './modelo.service';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';

@ApiTags('Modelos')
@Controller('modelos')
export class ModeloController {
  constructor(private readonly modeloService: ModeloService) {}

  @ApiOperation({ summary: 'Crear un modelo' })
  @ApiBody({ type: CreateModeloDto })
  @ApiCreatedResponse({ description: 'Modelo creado correctamente.' })
  @Post()
  create(@Body() createModeloDto: CreateModeloDto) {
    return this.modeloService.create(createModeloDto);
  }

  @ApiOperation({ summary: 'Listar todos los modelos' })
  @ApiOkResponse({ description: 'Lista de modelos obtenida correctamente.' })
  @Get()
  findAll() {
    return this.modeloService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un modelo por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del modelo' })
  @ApiOkResponse({ description: 'Modelo encontrado.' })
  @ApiNotFoundResponse({ description: 'Modelo no encontrado.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.modeloService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener precio vigente por fecha' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del modelo' })
  @ApiQuery({
    name: 'fecha',
    type: String,
    required: true,
    description: 'Fecha en formato YYYY-MM-DD',
  })
  @ApiOkResponse({ description: 'Precio obtenido correctamente.' })
  @Get(':id/precio')
  getPrecioPorFecha(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('fecha') fecha: string,
  ) {
    return this.modeloService.getPrecioPorFecha(id, fecha);
  }

  @ApiOperation({ summary: 'Actualizar un modelo por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del modelo' })
  @ApiBody({ type: UpdateModeloDto })
  @ApiOkResponse({ description: 'Modelo actualizado correctamente.' })
  @ApiNotFoundResponse({ description: 'Modelo no encontrado.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateModeloDto: UpdateModeloDto,
  ) {
    return this.modeloService.update(id, updateModeloDto);
  }

  @ApiOperation({ summary: 'Eliminar un modelo por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del modelo' })
  @ApiOkResponse({ description: 'Modelo eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Modelo no encontrado.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.modeloService.remove(id);
  }
}
