class CustomError{
    constructor(status,msg){
        this.status=status;
        this.msg=msg;
    }

    static catchBlockError(message)
    {
        return new CustomError(500,message);
    }
}

module.exports = CustomError;