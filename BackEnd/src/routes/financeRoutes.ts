import express from 'express';
import { FinanceManager } from '../models/FinanceManager';
import {
    DebitAccount,
    Loan,
    CreditAccount,
    SeparatedItem,
    InstallmentPayment
} from '../types/types';

const router = express.Router();
const financeManager = new FinanceManager();

// Middleware para manejo de errores
const errorHandler = (fn: Function) => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred',
        });
    }
};

// --- Rutas para Debito ---
router.get('/debit', errorHandler(async (req: any, res: { json: (arg0: { success: boolean; data: DebitAccount[]; total: number; }) => void; }) => {
    const accounts = await financeManager.getAllDebitAccounts();
    const debitNet: number = await financeManager.getDebitNet() as number;

    res.json({
        success: true,
        data: accounts,
        total: debitNet
    });
}));

router.post('/debit', errorHandler(async (req: { body: DebitAccount; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const account: DebitAccount = req.body;
    await financeManager.addDebitAccount(account);
    res.json({
        success: true,
        message: 'Debit account added successfully'
    });
}));

router.put('/debit/:name', errorHandler(async (req: { params: { name: any; }; body: { amount: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { name } = req.params;
    const { amount } = req.body;
    await financeManager.updateDebitAccount(name, amount);
    res.json({
        success: true,
        message: 'Debit account updated successfully'
    });
}));

router.delete('/debit/:name', errorHandler(async (req: { params: { name: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { name } = req.params;
    await financeManager.deleteDebitAccount(name);
    res.json({
        success: true,
        message: 'Debit account deleted successfully'
    });
}));

// --- Rutas para Prestamos ---
router.get('/loans', errorHandler(async (req: any, res: { json: (arg0: { success: boolean; data: Loan[]; total: number; }) => void; }) => {
    const loans = await financeManager.getAllLoans();
    const totalLoans = await financeManager.getLoansTotal() as number;
    res.json({
        success: true,
        data: loans,
        total: totalLoans
    });
}));

router.post('/loans', errorHandler(async (req: { body: Loan; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const loan: Loan = req.body;
    await financeManager.addLoan(loan);
    res.json({
        success: true,
        message: 'Loan added successfully'
    });
}));

router.put('/loans/:person', errorHandler(async (req: { params: { person: any; }; body: { amount: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { person } = req.params;
    const { amount } = req.body;
    await financeManager.updateLoan(person, amount);
    res.json({
        success: true,
        message: 'Loan updated successfully'
    });
}));

router.delete('/loans/:person', errorHandler(async (req: { params: { person: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { person } = req.params;
    await financeManager.deleteLoan(person);
    res.json({
        success: true,
        message: 'Loan deleted successfully'
    });
}));

// --- Rutas para Credito ---
router.get('/credit', errorHandler(async (req: any, res: { json: (arg0: { success: boolean; data: CreditAccount[]; total: number; }) => void; }) => {
    const accounts = await financeManager.getAllCreditAccounts();
    const totalCredit = await financeManager.getCreditTotal() as number;
    res.json({
        success: true,
        data: accounts,
        total: totalCredit
    });
}));

router.post('/credit', errorHandler(async (req: { body: CreditAccount; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const account: CreditAccount = req.body;
    await financeManager.addCreditAccount(account);
    res.json({
        success: true,
        message: 'Credit account added successfully'
    });
}));

router.put('/credit/:name', errorHandler(async (req: { params: { name: any; }; body: Partial<CreditAccount>; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { name } = req.params;
    const account: Partial<CreditAccount> = req.body;
    await financeManager.updateCreditAccount(name, account);
    res.json({
        success: true,
        message: 'Credit account updated successfully'
    });
}));

router.delete('/credit/:name', errorHandler(async (req: { params: { name: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { name } = req.params;
    await financeManager.deleteCreditAccount(name);
    res.json({
        success: true,
        message: 'Credit account deleted successfully'
    });
}));

// --- Rutas para Pagos en Mensualidades ---
router.get('/installments', errorHandler(async (req: any, res: { json: (arg0: { success: boolean; data: InstallmentPayment[]; }) => void; }) => {
    const payments = await financeManager.getAllInstallmentPayments();
    res.json({
        success: true,
        data: payments
    });
}));

router.post('/installments', errorHandler(async (req: { body: InstallmentPayment; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    // Transformar las fechas para asegurarse de que sean objetos Date
    const payment: InstallmentPayment = {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
    };

    // Guardar el pago
    await financeManager.addInstallmentPayment(payment);

    res.json({
        success: true,
        message: 'Installment payment added successfully'
    });
}));

router.get('/installments/current', errorHandler(async (req: any, res: { json: (arg0: { success: boolean; data: InstallmentPayment[]; }) => void; }) => {
    const currentDate = new Date();
    const currentPayments = await financeManager.getCurrentInstallmentPayments(currentDate);
    res.json({
        success: true,
        data: currentPayments
    });
}));

// --- Rutas para Separado ---
router.get('/separated', errorHandler(async (req: any, res: { json: (arg0: { success: boolean; data: SeparatedItem[]; total: number; }) => void; }) => {
    const items = await financeManager.getAllSeparatedItems();
    const totalItems = await financeManager.getSeparatedTotal() as number;
    res.json({
        success: true,
        data: items,
        total: totalItems
    });
}));

router.post('/separated', errorHandler(async (req: { body: SeparatedItem; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const item: SeparatedItem = req.body;
    await financeManager.addSeparatedItem(item);
    res.json({
        success: true,
        message: 'Separated item added successfully'
    });
}));

router.put('/separated/:concept', errorHandler(async (req: { params: { concept: any; }; body: { amount: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { concept } = req.params;
    const { amount } = req.body;
    await financeManager.updateSeparatedItem(concept, amount);
    res.json({
        success: true,
        message: 'Separated item updated successfully'
    });
}));

router.delete('/separated/:concept', errorHandler(async (req: { params: { concept: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { concept } = req.params;
    await financeManager.deleteSeparatedItem(concept);
    res.json({
        success: true,
        message: 'Separated item deleted successfully'
    });
}));

// --- Rutas para Subcategorias de Separado ---
router.get('/separated/:mainCategory/subcategories', errorHandler(async (req: { params: { mainCategory: any; }; }, res: { json: (arg0: { success: boolean; data: { [x: string]: number; }; total: number; }) => void; }) => {
    const { mainCategory } = req.params;
    const subcategories = await financeManager.getSubcategories(mainCategory);
    const total = await financeManager.getSubCategoryTotal(mainCategory);
    res.json({
        success: true,
        data: Object.fromEntries(subcategories),
        total: total
    });
}));

router.post('/separated/:mainCategory/subcategories', errorHandler(async (req: { params: { mainCategory: any; }; body: { name: any; amount: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { mainCategory } = req.params;
    const { name, amount } = req.body;
    await financeManager.addSubCategory(mainCategory, name, amount);
    res.json({
        success: true,
        message: 'Subcategory added successfully'
    });
}));

router.put('/separated/:mainCategory/subcategories/:name', errorHandler(async (req: { params: { mainCategory: any; name: any; }; body: { amount: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { mainCategory, name } = req.params;
    const { amount } = req.body;
    await financeManager.updateSubCategory(mainCategory, name, amount);
    res.json({
        success: true,
        message: 'Subcategory updated successfully'
    });
}));

router.delete('/separated/:mainCategory/subcategories/:name', errorHandler(async (req: { params: { mainCategory: any; name: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
    const { mainCategory, name } = req.params;
    await financeManager.deleteSubCategory(mainCategory, name);
    res.json({
        success: true,
        message: 'Subcategory deleted successfully'
    });
}));

// --- Ruta para Resumen General ---
router.get('/summary', errorHandler(async (req: any, res: { json: (arg0: { success: boolean; data: { debitNet: number; loans: number; credit: number; separated: number; currentInstallmentPayments: InstallmentPayment[]; }; }) => void; }) => {
    const debitNet: number = await financeManager.getDebitNet() as number;

    const summary = {
        debitNet: debitNet,
        loans: await financeManager.getLoansTotal(),
        credit: await financeManager.getCreditTotal(),
        separated: await financeManager.getSeparatedTotal(),
        currentInstallmentPayments: await financeManager.getCurrentInstallmentPayments(new Date())
    };

    res.json({
        success: true,
        data: summary
    });
}));

export default router;