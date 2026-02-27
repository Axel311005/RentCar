import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
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

@ApiTags('Modelos-Imagenes')
@Controller('modelos-imagenes')
export class VehiculoImagenController {
  constructor(private readonly vehiculoImagenService: VehiculoImagenService) {}

  @ApiOperation({ summary: 'Crear imagen para un modelo existente' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['modeloId'],
      properties: {
        modeloId: {
          type: 'string',
          format: 'uuid',
          description: 'UUID del modelo',
        },
        url: {
          type: 'string',
          format: 'uri',
          nullable: true,
          description: 'URL manual opcional, se usa si no se adjunta archivo',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen a subir a Supabase',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Imagen creada correctamente.' })
  @ApiNotFoundResponse({ description: 'Modelo no encontrado.' })
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  create(
    @Body() createDto: CreateVehiculoImagenDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const file = files?.find((item) =>
      ['file', 'imagen', 'image'].includes(item.fieldname),
    );

    return this.vehiculoImagenService.create(createDto, file ?? files?.[0]);
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
