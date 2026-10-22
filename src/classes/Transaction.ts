import { v4 } from 'uuid'
import { ITransaction, TransactionUpdate } from "../interfaces/ITransaction"
import { TransactionType } from "../interfaces/TransactionType"
import moment from 'moment'
import { formatCurrency } from 'formatCurrency'

export class Transaction implements ITransaction {
    public readonly id: string = v4()

    constructor(
        public amount: number,
        public type: TransactionType,
        public description: string | null = null,
        public date: moment.Moment = moment(),
    ) { }

    update(vals: TransactionUpdate): void {
        if (vals.amount !== undefined) {
            this.amount = vals.amount
        }
        if (vals.type !== undefined) {
            this.type = vals.type
        }
        if (vals.date !== undefined) {
            this.date = vals.date
        }
        if (vals.description !== undefined) {
            this.description = vals.description
        }
    }

    toString(): string {
        return `${this.id}: [${this.type.toLocaleUpperCase()}] ${formatCurrency(this.amount)} | ${this.getDescription()} | ${this.date.format("YYYY-MM-DD")}`
    }

    private getDescription(): string {
        return this.description === null || this.description.length === 0 ? "<empty>" : this.description
    }
}

export type TransactionConstructorParams = ConstructorParameters<typeof Transaction>
export type TransactionInstance = InstanceType<typeof Transaction>
