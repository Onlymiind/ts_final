export interface IIdentifiable {
    id: string
}

export interface IStorage<T extends IIdentifiable> {
    add(val: T): void
    removeById(id: string): void
    getAll(): T[]
    getById(id: string): T | undefined
}

export interface IStringifiable {
    toString(): string
}
