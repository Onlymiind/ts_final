import moment from 'moment'
import { TransactionType } from "./TransactionType"
import { IIdentifiable, IStringifiable } from './utility-types'

export interface ITransaction extends IIdentifiable, IStringifiable {
    amount: number
    type: TransactionType
    date: moment.Moment
    description: string | null

    update(vals: TransactionUpdate): void
}

export type TransactionUpdate = Partial<ITransaction>
export type CompleteTransaction = Required<ITransaction>
export type TransactionPreview = Pick<ITransaction, 'id' | 'amount' | 'type' | 'date'>
export type TransactionFieldType<TField> = TField extends keyof ITransaction ? ITransaction[TField] : never
export type OptionalTransaction<TFields extends keyof ITransaction> = Partial<Pick<ITransaction, TFields>> & Required<Omit<ITransaction, TFields>>
export type ReadonlyTransaction<TFields extends keyof ITransaction> = Readonly<Pick<ITransaction, TFields>> & Omit<ITransaction, TFields>
export type IsIncome<T> = T extends { type: TransactionType.INCOME } ? true : false
