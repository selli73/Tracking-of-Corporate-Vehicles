import { Controller } from '@nestjs/common';
import { CompanyService } from './company.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FLEET_PATTERNS, RegisterCompanyDto } from '@app/contracts';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @MessagePattern(FLEET_PATTERNS.REGISTER_COMPANY)
  register(@Payload() data: RegisterCompanyDto) {
    return this.companyService.register(data);
  }
}
