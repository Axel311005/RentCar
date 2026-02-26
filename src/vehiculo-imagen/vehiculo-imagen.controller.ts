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
import { VehiculoImagenService } from './vehiculo-imagen.service';
import { CreateVehiculoImagenDto } from './dto/create-vehiculo-imagen.dto';
import { UpdateVehiculoImagenDto } from './dto/update-vehiculo-imagen.dto';

@ApiTags('Vehiculo-Imagenes')
@Controller('vehiculo-imagenes')
export class VehiculoImagenController {
  constructor(private readonly vehiculoImagenService: VehiculoImagenService) {}

  @ApiOperation({ summary: 'Crear imagen para un modelo existente' })
  @ApiBody({ type: CreateVehiculoImagenDto })
  @ApiCreatedResponse({ description: 'Imagen creada correctamente.' })
  @ApiNotFoundResponse({ description: 'Modelo no encontrado.' })
  @Post()
  create(@Body() createDto: CreateVehiculoImagenDto) {
    return this.vehiculoImagenService.create(createDto);
  }

  @ApiOperation({ summary: 'Listar todas las imágenes' })
  @ApiOkResponse({ description: 'Imágenes obtenidas correctamente.' })
  @Get()
  findAll() {
    return this.vehiculoImagenService.findAll();
  }

  @ApiOperation({ summary: 'Listar imágenes por modelo' })
  @ApiParam({
    name: 'modeloId',
    format: 'uuid',
    description: 'UUID del modelo',
  })
  @ApiOkResponse({
    description: 'Imágenes del modelo obtenidas correctamente.',
  })
  @Get('modelo/:modeloId')
  findByModelo(@Param('modeloId', new ParseUUIDPipe()) modeloId: string) {
    return this.vehiculoImagenService.findByModelo(modeloId);
  }

  @ApiOperation({ summary: 'Obtener una imagen por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la imagen' })
  @ApiOkResponse({ description: 'Imagen encontrada.' })
  @ApiNotFoundResponse({ description: 'Imagen no encontrada.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.vehiculoImagenService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una imagen por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la imagen' })
  @ApiBody({ type: UpdateVehiculoImagenDto })
  @ApiOkResponse({ description: 'Imagen actualizada correctamente.' })
  @ApiNotFoundResponse({ description: 'Imagen o modelo no encontrado.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateVehiculoImagenDto,
  ) {
    return this.vehiculoImagenService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Eliminar una imagen por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la imagen' })
  @ApiOkResponse({ description: 'Imagen eliminada correctamente.' })
  @ApiNotFoundResponse({ description: 'Imagen no encontrada.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.vehiculoImagenService.remove(id);
  }
}
