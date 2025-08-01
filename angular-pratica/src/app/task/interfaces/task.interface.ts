export interface ITask {
    id: string,
    title: string,
    description?: string,
    tags?: string[],
    createdAt: Date,
    updatedAt?: Date,
    completed: boolean
}