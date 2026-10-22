import inquirer from 'inquirer'
import moment from 'moment'
import { Account } from './Account'
import { AccountManager } from './AccountManager'
import { Transaction } from './Transaction'
import { TransactionType } from '../interfaces/TransactionType'

export class ApplicationController {
    public readonly accountManager = new AccountManager()

    async start(): Promise<void> {
        try {
            while (!await this.mainMenu());
        } catch (error) {
            if (!this.isCancellation(error)) throw error
            console.log('\nGoodbye!')
        }
    }

    async mainMenu(): Promise<boolean> {
        const { action } = await inquirer.prompt<{ action: string }>([{
            type: 'select', name: 'action', message: 'Accounts',
            choices: [
                ...this.accountManager.getAll().map(account => ({
                    name: `${account.name} | ${account.getSummaryString()}`, value: account.id,
                })),
                { name: 'Create account', value: 'create' },
                { name: 'Exit', value: 'exit' },
            ],
        }])
        if (action === 'exit') {
            return true
        }
        try {
            if (action === 'create') await this.createAccount()
            else {
                const account = this.accountManager.getById(action)
                if (account instanceof Account) await this.watchAccount(account)
            }
        } catch (error) {
            if (this.isCancellation(error)) throw error
            console.error('Operation failed:', error instanceof Error ? error.message : error)
        }
        return false
    }

    async createAccount(): Promise<void> {
        const { name } = await inquirer.prompt<{ name: string }>([{
            type: 'input', name: 'name', message: 'Account name:',
            validate: (value: string) => value.trim().length > 0 || 'Enter a non-empty name.',
        }])
        this.accountManager.add(new Account(name.trim()))
    }

    async watchAccount(account: Account): Promise<void> {
        while (this.accountManager.getById(account.id)) {
            console.log(`\n${account.name}\n${account.getSummaryString()}`)
            const { action } = await inquirer.prompt<{ action: string }>([{
                type: 'select', name: 'action', message: 'Account actions',
                choices: [
                    { name: 'All transactions', value: 'transactions' },
                    { name: 'Add transaction', value: 'add' },
                    { name: 'Remove transaction', value: 'removeTransaction' },
                    { name: 'Export transactions to CSV', value: 'export' },
                    { name: 'Remove account', value: 'removeAccount' },
                    { name: 'Back to accounts', value: 'back' },
                ],
            }])
            if (action === 'back') return
            try {
                switch (action) {
                    case 'add': await this.addTransaction(account); break
                    case 'removeTransaction': await this.removeTransaction(account); break
                    case 'export': await this.exportTransactionsToCSV(account); break
                    case 'removeAccount': await this.removeAccount(account); break
                    case 'transactions': await this.watchTransactions(account); break
                }
            } catch (error) {
                if (this.isCancellation(error)) throw error
                console.error('Operation failed:', error instanceof Error ? error.message : error)
            }
        }
    }

    async watchTransactions(account: Account): Promise<void> {
        const transactions = account.getAll()
        if (transactions.length === 0) {
            console.log('No transactions yet.')
            return
        }
        await inquirer.prompt<{ id: string | null }>([{
            type: 'select', name: 'id', message: 'All transactions',
            pageSize: 10, loop: false,
            choices: [
                ...transactions.map(transaction => ({ name: transaction.toString(), value: transaction.id })),
                { name: 'Back to account', value: null },
            ],
        }])
    }

    async addTransaction(account: Account): Promise<void> {
        const answers = await inquirer.prompt<{ amount: string; type: TransactionType; date: string; description: string }>([
            {
                type: 'input', name: 'amount', message: 'Amount:',
                validate: (value: string) => (value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) > 0) || 'Enter a finite number greater than zero.'
            },
            {
                type: 'select', name: 'type', message: 'Transaction type:', choices: [
                    { name: 'Income', value: TransactionType.INCOME }, { name: 'Expense', value: TransactionType.EXPENSE },
                ]
            },
            {
                type: 'input', name: 'date', message: 'Date (YYYY-MM-DD):', default: moment().format('YYYY-MM-DD'),
                validate: (value: string) => moment(value, 'YYYY-MM-DD', true).isValid() || 'Enter a valid date in YYYY-MM-DD format.'
            },
            { type: 'input', name: 'description', message: 'Description:' },
        ])
        account.add(new Transaction(Number(answers.amount), answers.type, answers.description.trim(), moment(answers.date, 'YYYY-MM-DD', true)))
    }

    async removeTransaction(account: Account): Promise<void> {
        if (account.getAll().length === 0) {
            console.log('There are no transactions to remove.')
            return
        }
        const { id } = await inquirer.prompt<{ id: string | null }>([{
            type: 'select', name: 'id', message: 'Select a transaction:',
            choices: [...account.getAll().map(t => ({ name: t.toString(), value: t.id })), { name: 'Cancel', value: null }],
        }])
        if (id === null) return
        const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([{
            type: 'confirm', name: 'confirmed', message: 'Remove this transaction?', default: false,
        }])
        if (confirmed) account.removeById(id)
    }

    async removeAccount(account: Account): Promise<void> {
        const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([{
            type: 'confirm', name: 'confirmed', message: `Remove "${account.name}" and all its transactions?`, default: false,
        }])
        if (confirmed) {
            for (const transaction of [...account.getAll()]) account.removeById(transaction.id)
            this.accountManager.removeById(account.id)
        }
    }

    async exportTransactionsToCSV(account: Account): Promise<void> {
        const { filename } = await inquirer.prompt<{ filename: string }>([{
            type: 'input', name: 'filename', message: 'Export filename (without extension):',
            validate: (value: string) => {
                const name = value.trim()
                return (name.length > 0 && !/\.[^/\\]*$/.test(name)) || 'Enter a valid filename without extension.'
            },
        }])
        const path = `${filename.trim()}.csv`
        try {
            await account.exportTransactionsToCSV(path)
            console.log(`Exported successfully to ${path}`)
        } catch (error) {
            console.error('CSV export failed:', error instanceof Error ? error.message : error)
        }
    }

    private isCancellation(error: unknown): boolean {
        return error instanceof Error && (error.name === 'ExitPromptError' || error.name === 'AbortPromptError')
    }
}
