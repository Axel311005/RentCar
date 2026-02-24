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
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@ApiTags('Categorias')
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @ApiOperation({ summary: 'Crear una categoría' })
  @ApiBody({ type: CreateCategoriaDto })
  @ApiCreatedResponse({ description: 'Categoría creada correctamente.' })
  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiOkResponse({ description: 'Lista de categorías obtenida correctamente.' })
  @Get()
  findAll() {
    return this.categoriaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una categoría por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la categoría' })
  @ApiOkResponse({ description: 'Categoría encontrada.' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriaService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una categoría por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la categoría' })
  @ApiBody({ type: UpdateCategoriaDto })
  @ApiOkResponse({ description: 'Categoría actualizada correctamente.' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.update(id, updateCategoriaDto);
  }

  @ApiOperation({ summary: 'Eliminar una categoría por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID de la categoría' })
  @ApiNoContentResponse({ description: 'Categoría eliminada correctamente.' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriaService.remove(id);
  }
}
