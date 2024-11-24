export interface DebitAccount {
    name: string;
    amount: number;
}

export interface Loan {
    person: string;
    amount: number;
}

export interface CreditAccount {
    name: string;
    debt: number;
    monthlyPayment: number;
    creditLimit: number;
}

export interface SeparatedItem {
    concept: string;
    amount: number;
}

export interface InstallmentPayment {
    concept: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    totalPayments: number;
}
