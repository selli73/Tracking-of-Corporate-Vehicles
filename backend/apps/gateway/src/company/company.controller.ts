import { Body, Controller, Post } from '@nestjs/common';
import { CompanyService } from './company.service.js';
import { CompanyResponseCreate, RegisterCompanyDto } from '@app/contracts';

@Controller('company')
export class CompanyController {
  constructor(private readonly _companyService: CompanyService) {}

  @Post('register')
  register(@Body() dto: RegisterCompanyDto) {
    return this._companyService.register(dto);
  }
}
