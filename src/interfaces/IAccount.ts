import { ISummarizable } from './ISummary'
import { ITransaction } from "./ITransaction"

export interface IAccount extends ISummarizable {
    id: number
    name: string

    addTransaction(transaction: ITransaction): void
    removeTransactionById(id: number): void
    getTransactions(): ITransaction[]

    toString(): string
}