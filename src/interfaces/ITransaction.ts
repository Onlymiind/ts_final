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
