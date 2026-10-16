export class PaymentDto {
    constructor(public readonly userId: string, public readonly driverEmail: string, public readonly bookingId: string, public readonly amount: number) {}
}