export interface IAlert {
    message: string,
    color: 'green' | 'red' | 'blue',
    isVisible?: boolean
}