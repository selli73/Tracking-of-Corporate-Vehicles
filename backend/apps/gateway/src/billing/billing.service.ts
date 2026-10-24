import { BILLING_PATTERNS, BILLING_SERVICE, RpcRequest, UserContext } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class BillingService {

    constructor(@Inject(BILLING_SERVICE) private _billingClient: ClientProxy) {}

    async getInvoices(user: UserContext) {
        const response = await firstValueFrom(this._billingClient.send<unknown, UserContext>(BILLING_PATTERNS.GET_INVOICES, user).pipe(timeout(4000)));

        return response;
    }

    async payInvoice(invoiceId: string, user: UserContext) {
        const response = await firstValueFrom(this._billingClient.send<RpcRequest<{ invoiceId: string }>>(BILLING_PATTERNS.PAY_INVOICE, { user, data: { invoiceId } }).pipe(timeout(4000)));

        return response;
    }
}
