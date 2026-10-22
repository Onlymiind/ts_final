import { IAccount } from "./IAccount"
import { ISummarizable } from "./ISummary"
import { IStorage } from './utility-types'

export interface IAccountManager extends ISummarizable, IStorage<IAccount> {
    readonly income: number
    readonly expenses: number
    readonly balance: number
}