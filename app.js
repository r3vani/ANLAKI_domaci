const express = require("express");
const app = express();
const poveziBazu = require("./baza/baza");
const account = require("./baza/account");

const port = 80;

app.use(express.json());

//Povezivanje sa bazom
poveziBazu();

app.use(express.static("front"));

app.listen(port, () => {
    console.log(`Server slusa na portu ${port}.`);
});

//Uzimanje svih naloga iz baze
app.get("/api/svinalozi", async (req,res) => {
    try 
    {
        const sviNalozi = await account.find();
        res.json(sviNalozi);
    }
    catch (err) 
    {
        console.log(err.message);
    }
});

//Registrovanje novog naloga
app.post("/api/register", async (req, res) => {
    try 
    {
        let takenMail = false;
        let takenUsername = false;
        let sadrzi = true;

        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const ime = req.body.ime;
        const prezime = req.body.ime;

        const sviNalozi = await account.find();
        sviNalozi.forEach((nalog) => {
            if(nalog.username == username) takenUsername = true;
            if(nalog.email == email) takenMail = true;
            if(!email.includes('@')) sadrzi = false;
        });

        if(takenUsername) console.log("Korisnicko ime je vec zauzeto.");
        else if(takenMail) console.log("E-Mail je vec zauzet.");
        else if(!sadrzi) console.log("E-Mail mora sadrzati @!");
        else 
        {
            const noviAccount = new account({
                email: email,
                username: username,
                password: password,
                ime: ime,
                prezime: prezime,
            });
            const napravljenAccount = await noviAccount.save();
            res.json(napravljenAccount);
        }
    }
    catch (err) 
    {
        console.log(err.message);
    }
});

//Brisanje naloga
app.delete("/api/delete/:id", async (req, res) => {
    try 
    {
        const id = req.params.id;
        const trazeniAccount = await account.findById(id);
        const obrisanAccount = await trazeniAccount.delete();
        res.json(obrisanAccount);
    }
    catch (err) 
    {
        console.log(err.message);
    }
})