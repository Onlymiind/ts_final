import { ITransaction } from "./ITransaction"

export interface IAccount {
    id: number
    name: string

    addTransaction(transaction: ITransaction): void
    removeTransactionById(id: number): void
    getTransactions(): ITransaction[]
}