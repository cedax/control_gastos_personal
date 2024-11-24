import mongoose from 'mongoose';

export const DebitAccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true }
});

export const LoanSchema = new mongoose.Schema({
    person: { type: String, required: true },
    amount: { type: Number, required: true }
});

export const CreditAccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    debt: { type: Number, required: true },
    limit: { type: Number },
    interest: { type: Number }
});

export const InstallmentPaymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

export const SeparatedItemSchema = new mongoose.Schema({
    concept: { type: String, required: true },
    amount: { type: Number, required: true },
});

export const SubCategorySchema = new mongoose.Schema({
    mainCategory: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true }
});

// Create models
export const DebitAccountDB = mongoose.model('DebitAccount', DebitAccountSchema);
export const LoanDB = mongoose.model('Loan', LoanSchema);
export const CreditAccountDB = mongoose.model('CreditAccount', CreditAccountSchema);
export const InstallmentPaymentDB = mongoose.model('InstallmentPayment', InstallmentPaymentSchema);
export const SeparatedItemDB = mongoose.model('SeparatedItem', SeparatedItemSchema);
export const SubCategoryDB = mongoose.model('SubCategory', SubCategorySchema);