import { Account } from './classes/Account'
import { Transaction, TransactionConstructorParams, TransactionInstance } from './classes/Transaction'
import { AccountManager } from './classes/AccountManager'
import { TransactionType, limits } from './interfaces/TransactionType'
import moment from 'moment'
import { IsIncome, ITransaction, OptionalTransaction, ReadonlyTransaction, TransactionFieldType } from './interfaces/ITransaction'

const personalAccount = new Account('Личный бюджет')
const transaction: Transaction = new Transaction(1000, TransactionType.INCOME, 'Зарплата', moment('2023-01-01T00:00:00Z'))

transaction.update({ amount: 1200 })
console.log('Обновлённая транзакция:')
console.log(transaction)

personalAccount.add(transaction)
personalAccount.add(new Transaction(200, TransactionType.EXPENSE, 'Продукты', moment('2023-01-05T00:00:00Z')))
personalAccount.add(new Transaction(150, TransactionType.EXPENSE, 'Коммунальные услуги', moment('2023-01-09T00:00:00Z')))

personalAccount.update({ name: 'Основной счёт' })
console.log('Обновлённый счёт:')
console.log(personalAccount)

const manager = new AccountManager()
manager.add(personalAccount)

console.log(String(personalAccount))
console.log(`Общий баланс всех бюджетов: ${manager.balance} ₽`)

console.log('\nТранзакции основного счёта:')
personalAccount.getAll().forEach(t => console.log(t.toString()))

console.log('Лимит пополнений:', limits.income)
console.log('Лимит трат:', limits.expense)

const transactionParams: TransactionConstructorParams = [500, TransactionType.EXPENSE, 'Покупка', moment('2023-02-01T00:00:00Z')]
const newTransaction: TransactionInstance = new Transaction(...transactionParams)
console.log(newTransaction.toString())

try {
    personalAccount.exportTransactionsToCSV('main_account.csv')
} catch (error: unknown) {
    console.log("В процессе записи произошла ошибка", (error as Error).message)
}
