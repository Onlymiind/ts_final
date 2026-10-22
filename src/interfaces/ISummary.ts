export interface ISummary {
    income: number
    expenses: number
    balance: number
}

export interface ISummarizable {
    getSummary(): ISummary

    getSummaryString(): string
}
