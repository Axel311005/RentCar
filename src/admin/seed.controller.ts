import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { SeedService } from './seed.service';

@ApiTags('Admin')
@Controller('admin')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('seed')
  //@Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Ejecutar seed inicial de datos' })
  @ApiResponse({ status: 201, description: 'Seed ejecutado correctamente.' })
  runSeed() {
    return this.seedService.run();
  }
}
