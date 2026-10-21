import { IAccount } from '../interfaces/IAccount'
import { ISummary } from '../interfaces/ISummary'
import { ITransaction } from '../interfaces/ITransaction'
import { TransactionType } from '../interfaces/TransactionType'

export class Account implements IAccount {
    private transactions: ITransaction[] = []

    constructor(
        public readonly id: number,
        public readonly name: string,
    ) { }


    addTransaction(transaction: ITransaction): void {
        this.transactions.push(transaction)
    }

    removeTransactionById(id: number): void {
        this.transactions = this.transactions.filter((transaction: ITransaction) => transaction.id !== id)
    }

    getTransactions(): ITransaction[] {
        return this.transactions
    }

    getSummary(): ISummary {
        let result = { income: 0, expenses: 0, balance: 0 } as ISummary

        for (let transaction of this.transactions) {
            switch (transaction.type) {
                case TransactionType.EXPENSE: result.expenses += transaction.amount; break
                case TransactionType.INCOME: result.income += transaction.amount; break
            }
        }

        result.balance = result.income - result.expenses

        return result
    }

    getSummaryString(): string {
        const summary = this.getSummary()
        return `Income: ${summary.income}, expenses: ${summary.expenses}, balance: ${summary.balance}`
    }

    toString(): string {
        let result = `${this.name}\nTransactions:`
        for (let transaction of this.transactions) {
            result += `\n${transaction.toString()}`
        }

        return result
    }
}