const mongoose = require("mongoose")

const connet = async() => {
    try{
        await mongoose.connect(process.env.MONGO_CLIENT)
        console.log("Database connected")
    }
    catch(err)
    {
        console.log(err);
    }
}

connet()