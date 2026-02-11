

export default class CustomApiError extends Error {
    statusCode: number
    constructor(message: string) {
        super(message)
        this.statusCode = 500
    }
}
