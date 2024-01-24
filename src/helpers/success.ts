const createSuccess = (status: number, message: string, data: any): object => {
    return {
        status,
        message,
        data
    };
};

export {createSuccess};
