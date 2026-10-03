import { UserContext } from "@app/contracts/auth/user-context";

export interface IStartOrFinishBooking {
    user: UserContext, 
    data: { 
        bookingId: string;
    }
}