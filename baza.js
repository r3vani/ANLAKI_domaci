const mongoose = require("mongoose");

async function poveziBazu() 
{
    const link = "mongodb+srv://lukju:lukju94@cluster0.9m89z.mongodb.net/anlaki?retryWrites=true&w=majority";

    try
    {
        const konektovanaBaza = await mongoose.connect(link, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        console.log("Baza je povezana.");
    }
    catch (err) 
    {
        console.log(err.message);
    }
}

module.exports = poveziBazu;