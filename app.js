const express = require("express");
const app = express();
const poveziBazu = require("./baza/baza");
const account = require("./baza/account");
const desavanje = require("./baza/desavanje");

const port = 80;

app.use(express.json());

//Povezivanje sa bazom
poveziBazu();

app.listen(port, () => {
    console.log(`Server slusa na portu ${port}.`);
});

//INTERAKCIJA SA NALOZIMA
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

//Update-ovanje naloga
app.put("/api/update/:id", async (req, res) => {
    try 
    {
        const id = req.params.id;
        let promenjenNalog = await account.findByIdAndUpdate(id, req.body);
        res.json(req.body);
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
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const ime = req.body.ime;
        const prezime = req.body.prezime;

        const sviNalozi = await account.find();

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
});

//INTERAKCIJA SA DESAVANJIMA
//Uzimanje svih desavanja iz baze
app.get("/api/svadesavanja", async (req, res) => {
    try 
    {
        const svaDesavanja = await desavanje.find();
        res.json(svaDesavanja);
    }
    catch (err) 
    {
        console.log(err.message);
    }
});

//Dodavanje novog desavanja
app.post("/api/novodesavanje", async (req, res) => {
    try 
    {
        let naziv = req.body.naziv;
        let vreme = req.body.vreme;
        let mesto = req.body.mesto;
        let opis = req.body.opis;
        let idKreatora = req.body.idKreatora;

        let novoDesavanje = new desavanje({
            naziv: naziv,
            vreme: vreme,
            mesto: mesto,
            opis: opis,
            idKreatora: idKreatora
        });

        let sacuvanoDesavanje = await novoDesavanje.save();
        res.json(sacuvanoDesavanje);
    }
    catch (err) 
    {
        console.log(err.message);
    }
});

//Brisanje desavanja
app.delete("/api/obrisi/:id", async (req, res) => {
    try 
    {
        const id = req.params.id;
        const trazenoDesavanje = await desavanje.findById(id);
        const obrisanoDesavanje = await trazenoDesavanje.delete();
        res.json(obrisanoDesavanje);
    }
    catch (err) 
    {
        console.log(err.message);
    }
});

app.use(express.static("front"));