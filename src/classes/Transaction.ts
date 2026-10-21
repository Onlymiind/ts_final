import { ITransaction } from "../interfaces/ITransaction"
import { TransactionType } from "../interfaces/TransactionType"

export class Transaction implements ITransaction {
    constructor(
        public readonly id: number,
        public readonly amount: number,
        public readonly type: TransactionType,
        public readonly date: string,
        public readonly description: string
    ) { }

    toString(): string {
        return `#${this.id}: [${this.type.toLocaleUpperCase()}] ${this.amount} | ${this.description} | ${this.date}`
    }
}