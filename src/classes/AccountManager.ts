import { IAccount } from '../interfaces/IAccount'
import { IAccountManager } from '../interfaces/IAccountManager'
import { ISummary } from '../interfaces/ISummary'

export class AccountManager implements IAccountManager {
    private accounts: IAccount[] = []

    get income(): number {
        return this.getStat('income')
    }

    get expenses(): number {
        return this.getStat('expenses')
    }

    get balance(): number {
        return this.getStat('balance')
    }

    add(account: IAccount): void {
        this.accounts.push(account)
    }

    removeById(id: string): void {
        this.accounts = this.accounts.filter((account) => account.id !== id)
    }

    getAll(): IAccount[] {
        return this.accounts
    }

    getById(id: string): IAccount | undefined {
        return this.accounts.find((account) => account.id === id)
    }

    getSummary(): ISummary {
        return this.accounts.map((account) => account.getSummary()).reduce((prev, current) => ({
            income: prev.income + current.income,
            expenses: prev.expenses + current.expenses,
            balance: prev.balance + current.balance
        } as ISummary))
    }

    getSummaryString(): string {
        const summary = this.getSummary()
        return `Income: ${summary.income}, expenses: ${summary.expenses}, balance: ${summary.balance}`
    }

    private getStat(name: keyof ISummary): number {
        return this.accounts.map((account) => account.getSummary()[name]).reduce((prev, current) => prev + current)
    }
}