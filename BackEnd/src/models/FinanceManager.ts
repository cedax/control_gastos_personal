import { CreditAccount, DebitAccount, InstallmentPayment, Loan, SeparatedItem } from "../types/types";

import {
    DebitAccountDB,
    LoanDB,
    CreditAccountDB,
    InstallmentPaymentDB,
    SeparatedItemDB,
    SubCategoryDB
} from './DatabaseModels';

export interface IFinanceManager {
    // Debito
    getAllDebitAccounts(): Promise<DebitAccount[]>;
    addDebitAccount(account: DebitAccount): Promise<void>;
    updateDebitAccount(name: string, amount: number): Promise<void>;
    deleteDebitAccount(name: string): Promise<void>;
    getDebitNet(): Promise<Number>;

    // Prestamos
    getAllLoans(): Promise<Loan[]>;
    addLoan(loan: Loan): Promise<void>;
    updateLoan(person: string, amount: number): Promise<void>;
    deleteLoan(person: string): Promise<void>;
    getLoansTotal(): Promise<number>;

    // Credito
    getAllCreditAccounts(): Promise<CreditAccount[]>;
    addCreditAccount(account: CreditAccount): Promise<void>;
    updateCreditAccount(name: string, account: Partial<CreditAccount>): Promise<void>;
    deleteCreditAccount(name: string): Promise<void>;
    getCreditTotal(): Promise<number>;

    // Pagos en Mensualidades
    getAllInstallmentPayments(): Promise<InstallmentPayment[]>;
    addInstallmentPayment(payment: InstallmentPayment): Promise<void>;
    getCurrentInstallmentPayments(date: Date): Promise<InstallmentPayment[]>;

    // Separado
    getAllSeparatedItems(): Promise<SeparatedItem[]>;
    addSeparatedItem(item: SeparatedItem): Promise<void>;
    updateSeparatedItem(concept: string, amount: number): Promise<void>;
    deleteSeparatedItem(concept: string): Promise<void>;
    getSeparatedTotal(): Promise<number>;

    // Subcategorias
    getSubcategories(mainCategory: string): Promise<Map<string, number>>;
    addSubCategory(mainCategory: string, name: string, amount: number): Promise<void>;
    updateSubCategory(mainCategory: string, name: string, amount: number): Promise<void>;
    deleteSubCategory(mainCategory: string, name: string): Promise<void>;
    getSubCategoryTotal(mainCategory: string): Promise<number>;
}

export class FinanceManager implements IFinanceManager {
    // --- Metodos para Debito ---
    public async getAllDebitAccounts(): Promise<DebitAccount[]> {
        return await DebitAccountDB.find();
    }

    public async addDebitAccount(account: DebitAccount): Promise<void> {
        await DebitAccountDB.create(account);
    }

    public async updateDebitAccount(name: string, amount: number): Promise<void> {
        await DebitAccountDB.findOneAndUpdate({ name }, { amount }, { upsert: true });
    }

    public async deleteDebitAccount(name: string): Promise<void> {
        await DebitAccountDB.findOneAndDelete({ name });
    }

    public async getDebitNet(): Promise<Number> {
        const accounts = await DebitAccountDB.find();
        return accounts.reduce((total, account) => total + account.amount, 0);
    }

    // --- Metodos para Prestamos ---
    public async getAllLoans(): Promise<Loan[]> {
        return await LoanDB.find();
    }

    public async addLoan(loan: Loan): Promise<void> {
        await LoanDB.create(loan);
    }

    public async updateLoan(person: string, amount: number): Promise<void> {
        await LoanDB.findOneAndUpdate({ person: person }, { amount }, { upsert: true });
    }

    public async deleteLoan(person: string): Promise<void> {
        await LoanDB.findOneAndDelete({ person });
    }

    public async getLoansTotal(): Promise<number> {
        const loans = await LoanDB.find();
        return loans.reduce((total, loan) => total + loan.amount, 0);
    }

    // --- Metodos para Credito ---
    public async getAllCreditAccounts(): Promise<CreditAccount[]> {
        return await CreditAccountDB.find();
    }

    public async addCreditAccount(account: CreditAccount): Promise<void> {
        await CreditAccountDB.create(account);
    }

    public async updateCreditAccount(name: string, accountUpdate: Partial<CreditAccount>): Promise<void> {
        await CreditAccountDB.findOneAndUpdate({ name }, accountUpdate, { upsert: true });
    }

    public async deleteCreditAccount(name: string): Promise<void> {
        await CreditAccountDB.findOneAndDelete({ name });
    }

    public async getCreditTotal(): Promise<number> {
        const accounts = await CreditAccountDB.find();
        return accounts.reduce((total, account) => total + account.debt, 0);
    }

    // --- Metodos para Pagos en Mensualidades ---
    public async getAllInstallmentPayments(): Promise<InstallmentPayment[]> {
        return await InstallmentPaymentDB.find();
    }

    public async addInstallmentPayment(payment: InstallmentPayment): Promise<void> {
        await InstallmentPaymentDB.create(payment);
    }

    public async getCurrentInstallmentPayments(date: Date): Promise<InstallmentPayment[]> {
        return await InstallmentPaymentDB.find({ startDate: { $lte: date }, endDate: { $gte: date } });
    }

    // --- Metodos para Separado ---
    public async getAllSeparatedItems(): Promise<SeparatedItem[]> {
        return await SeparatedItemDB.find();
    }

    public async addSeparatedItem(item: SeparatedItem): Promise<void> {
        await SeparatedItemDB.create(item);
    }

    public async updateSeparatedItem(concept: string, amount: number): Promise<void> {
        await SeparatedItemDB.findOneAndUpdate({ concept }, { amount });
    }

    public async deleteSeparatedItem(concept: string): Promise<void> {
        await SeparatedItemDB.findOneAndDelete({ concept });
    }

    public async getSeparatedTotal(): Promise<number> {
        const items = await SeparatedItemDB.find();
        return items.reduce((total, item) => total + item.amount, 0);
    }

    // --- Metodos para Subcategorias ---
    public async getSubcategories(mainCategory: string): Promise<Map<string, number>> {
        const subcategories = await SubCategoryDB.find({ mainCategory });
        const result = new Map<string, number>();
        subcategories.forEach(subcategory => result.set(subcategory.name, subcategory.amount));
        return result;
    }

    public async addSubCategory(mainCategory: string, name: string, amount: number): Promise<void> {
        await SubCategoryDB.create({ mainCategory, name, amount });
    }

    public async updateSubCategory(mainCategory: string, name: string, amount: number): Promise<void> {
        await SubCategoryDB.findOneAndUpdate({ mainCategory, name }, { amount }, { upsert: true });
    }

    public async deleteSubCategory(mainCategory: string, name: string): Promise<void> {
        await SubCategoryDB.findOneAndDelete({ mainCategory, name });
    }

    public async getSubCategoryTotal(mainCategory: string): Promise<number> {
        const subcategories = await SubCategoryDB.find();
        return subcategories.reduce((total, subcategory) => total + subcategory.amount, 0);
    }
}