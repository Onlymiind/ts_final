import { IAccount } from "./IAccount"
import { ISummarizable } from "./ISummary"

export interface IAccountManager extends ISummarizable {
    readonly income: number
    readonly expenses: number
    readonly balance: number

    addAccount(account: IAccount): void
    removeAccountById(id: number): void
    getAccounts(): IAccount[]
    getAccountById(id: number): IAccount | undefined
}