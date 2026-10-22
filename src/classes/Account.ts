import { v4 } from 'uuid'
import { AccountUpdate, IAccount } from '../interfaces/IAccount'
import { ISummary } from '../interfaces/ISummary'
import { ITransaction } from '../interfaces/ITransaction'
import { TransactionType } from '../interfaces/TransactionType'
import { writeFile } from 'fs/promises'
import { escapeCsvValue } from '../utils/escapeCsvValue'
import moment from 'moment'

export class Account implements IAccount {
    private transactions: ITransaction[] = []
    public readonly id: string = v4()

    constructor(
        public name: string,
    ) { }

    update(vals: AccountUpdate): void {
        if (vals.name !== undefined) {
            this.name = vals.name
        }
    }


    add(transaction: ITransaction): void {
        this.transactions.push(transaction)
    }

    removeById(id: string): void {
        this.transactions = this.transactions.filter((transaction: ITransaction) => transaction.id !== id)
    }

    getAll(): ITransaction[] {
        return this.transactions
    }

    getById(id: string): ITransaction | undefined {
        return this.transactions.find((transaction) => transaction.id === id)
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

    async exportTransactionsToCSV(filename: string): Promise<void> {
        const headlines: (keyof Pick<ITransaction, "id" | "amount" | "type" | "date" | "description">)[] = ["id", "amount", "type", "date", "description"]

        const rows = this.transactions.map(transaction => headlines.map(propName => {
            const value = transaction[propName]
            return escapeCsvValue(moment.isMoment(value) ? value.format('YYYY-MM-DD') : value ?? '')
        }).join(','))
        await writeFile(filename, [headlines.join(','), ...rows].join('\n') + '\n', 'utf8')
    }
}
