import { Role } from '@app/contracts/gateway/role.enum';

export interface IJwtUserRequest {
  user: {
    userId: string;
    role: Role;
    companyId: string;
  };
}
