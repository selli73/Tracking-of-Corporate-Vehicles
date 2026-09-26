export class CompanyResponseCreate {
    company: { 
        id: string,
        officialName: string,
        shortName: string  
    };

    user: {
        id: string,
        email: string,
        name: string,
        surname: string,
        role: string,
        companyId: string
    }
}