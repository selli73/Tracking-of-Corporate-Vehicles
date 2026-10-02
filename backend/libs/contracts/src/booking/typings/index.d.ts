export interface IStartOrFinishBooking {
    user: {           
        companyId: string;
    }, 
    data: { 
        bookingId: string;
    }
}