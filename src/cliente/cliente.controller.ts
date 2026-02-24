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
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@ApiTags('Clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @ApiOperation({ summary: 'Crear un cliente' })
  @ApiBody({ type: CreateClienteDto })
  @ApiCreatedResponse({ description: 'Cliente creado correctamente.' })
  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiOkResponse({ description: 'Lista de clientes obtenida correctamente.' })
  @Get()
  findAll() {
    return this.clienteService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un cliente por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del cliente' })
  @ApiOkResponse({ description: 'Cliente encontrado.' })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.clienteService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un cliente por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del cliente' })
  @ApiBody({ type: UpdateClienteDto })
  @ApiOkResponse({ description: 'Cliente actualizado correctamente.' })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @ApiOperation({ summary: 'Eliminar un cliente por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del cliente' })
  @ApiNoContentResponse({ description: 'Cliente eliminado correctamente.' })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.clienteService.remove(id);
  }
}
