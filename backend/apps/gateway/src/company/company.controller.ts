import { Body, Controller, Post } from '@nestjs/common';
import { CompanyService } from './company.service.js';
import { RegisterCompanyDto } from '@app/contracts';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('company')
export class CompanyController {
  constructor(private readonly _companyService: CompanyService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a company'}) @ApiResponse({ status: 201, description: 'The company has been successfully registered' })
  register(@Body() dto: RegisterCompanyDto) {
    return this._companyService.register(dto);
  }
}
