export const enum TransactionType {
    INCOME = 'income', EXPENSE = 'expense'
}

export type CategoryLimits = Record<TransactionType, number>

export const limits: CategoryLimits = {
    income: 10000,
    expense: 5000,
}