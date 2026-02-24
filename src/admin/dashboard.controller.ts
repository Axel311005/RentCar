import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Admin')
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Obtener resumen del panel de administración' })
  @ApiOkResponse({
    description: 'Resumen del dashboard obtenido correctamente.',
  })
  @Get('resumen')
  getResumen() {
    return this.dashboardService.getResumen();
  }
}
