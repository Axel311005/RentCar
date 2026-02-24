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
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@ApiTags('Empleados')
@Controller('empleados')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @ApiOperation({ summary: 'Crear un empleado' })
  @ApiBody({ type: CreateEmpleadoDto })
  @ApiCreatedResponse({ description: 'Empleado creado correctamente.' })
  @Post()
  create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadoService.create(createEmpleadoDto);
  }

  @ApiOperation({ summary: 'Listar todos los empleados' })
  @ApiOkResponse({ description: 'Lista de empleados obtenida correctamente.' })
  @Get()
  findAll() {
    return this.empleadoService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un empleado por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del empleado' })
  @ApiOkResponse({ description: 'Empleado encontrado.' })
  @ApiNotFoundResponse({ description: 'Empleado no encontrado.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.empleadoService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un empleado por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del empleado' })
  @ApiBody({ type: UpdateEmpleadoDto })
  @ApiOkResponse({ description: 'Empleado actualizado correctamente.' })
  @ApiNotFoundResponse({ description: 'Empleado no encontrado.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEmpleadoDto: UpdateEmpleadoDto,
  ) {
    return this.empleadoService.update(id, updateEmpleadoDto);
  }

  @ApiOperation({ summary: 'Eliminar un empleado por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del empleado' })
  @ApiOkResponse({ description: 'Empleado eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Empleado no encontrado.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.empleadoService.remove(id);
  }
}
