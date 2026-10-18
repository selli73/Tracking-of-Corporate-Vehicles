import { UserContext } from "@app/contracts/auth/user-context";

export interface ChangeStatusBooking {
    user: UserContext, 
    data: { 
        bookingId: string;
    }
}