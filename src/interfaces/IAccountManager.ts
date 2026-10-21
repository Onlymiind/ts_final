import { IAccount } from "./IAccount";
import { ISummary } from "./ISummary";

export interface IAccountManager {
    addAccount(account: IAccount): void
    removeAccountById(id: number): void
    getAccounts(): IAccount[]
    getAccountById(id: number): IAccount | undefined
    getSummary(accountId: number): ISummary | undefined
}