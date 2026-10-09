import { Body, Controller, Delete, Get, Inject, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { TariffService } from './tariff.service.js';
import { CreateTariffDto, Role } from '@app/contracts';
import type { DeleteTariffDto, IJwtUserRequest, UpdateTariffDto } from '@app/contracts';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard.js';
import { RolesGuard } from '../roles/guards/roles.guard.js';
import { Roles } from '../roles/roles.decorator.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tariff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.COMPANY_ADMIN)
@ApiBearerAuth()
export class TariffController {
  constructor(private readonly _tariffService: TariffService) {}

  @Post('create')
  @ApiOperation({ summary: 'Creating a vehicle tariff'}) @ApiResponse({ status: 201, description: 'The rate is tied to the vehicle' })
  create(@Request() req: IJwtUserRequest, @Body() dto: CreateTariffDto) {
    return this._tariffService.create(dto, req.user.companyId);
  }

  @Get('get-company-rates')
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER, Role.DRIVER)
  @ApiOperation({ summary: 'Get the company rates'}) @ApiResponse({ status: 200, description: 'Rates successfully retrieved' })
  getCompanyRates(@Request() req: IJwtUserRequest) {
    return this._tariffService.getCompanyRates(req.user.companyId);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Change plan details'}) @ApiResponse({ status: 200, description: 'The tariff has been successfully changed' })
  update(@Request() req: IJwtUserRequest, @Body() dto: UpdateTariffDto) {
    return this._tariffService.update(dto, req.user.companyId);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete tariff'}) @ApiResponse({ status: 200, description: 'The tariff has been successfully deleted' })
  delete(@Request() req: IJwtUserRequest, @Body() dto: DeleteTariffDto) {
    return this._tariffService.delete(dto, req.user.companyId);
  }
}
