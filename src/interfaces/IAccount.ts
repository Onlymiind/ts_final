import { ISummarizable } from './ISummary'
import { ITransaction } from "./ITransaction"
import { IIdentifiable, IStorage, IStringifiable } from './utility-types'

export interface IAccount extends ISummarizable, IIdentifiable, IStorage<ITransaction>, IStringifiable {
    name: string

    update(vals: AccountUpdate): void
}

export type AccountUpdate = Partial<IAccount>
export type AccountInfo = Pick<IAccount, 'id' | 'name'>
