class CustomError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

// Example of how to use the CustomError class
const createError = (status: number, message: string): CustomError => {
    return new CustomError(status, message);
};

export {createError};
