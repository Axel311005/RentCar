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
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@ApiTags('Vehiculos')
@Controller('vehiculos')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @ApiOperation({ summary: 'Crear un vehículo' })
  @ApiBody({ type: CreateVehiculoDto })
  @ApiCreatedResponse({ description: 'Vehículo creado correctamente.' })
  @Post()
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculoService.create(createVehiculoDto);
  }

  @ApiOperation({ summary: 'Listar todos los vehículos' })
  @ApiOkResponse({ description: 'Lista de vehículos obtenida correctamente.' })
  @Get()
  findAll() {
    return this.vehiculoService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un vehículo por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del vehículo' })
  @ApiOkResponse({ description: 'Vehículo encontrado.' })
  @ApiNotFoundResponse({ description: 'Vehículo no encontrado.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.vehiculoService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un vehículo por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del vehículo' })
  @ApiBody({ type: UpdateVehiculoDto })
  @ApiOkResponse({ description: 'Vehículo actualizado correctamente.' })
  @ApiNotFoundResponse({ description: 'Vehículo no encontrado.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculoService.update(id, updateVehiculoDto);
  }

  @ApiOperation({ summary: 'Eliminar un vehículo por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del vehículo' })
  @ApiOkResponse({ description: 'Vehículo eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Vehículo no encontrado.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.vehiculoService.remove(id);
  }
}
