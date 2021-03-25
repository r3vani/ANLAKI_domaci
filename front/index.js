async function mainStranicaLoad() 
{
    glavnaStranicaLoad();
    let svaDesavanjaData = await axios.get("/api/svadesavanja");
    let svaDesavanja = svaDesavanjaData.data;
    const accounCardConainerID = document.getElementById("accounCardConainerID");
    accounCardConainerID.innerHTML = napraviDesavanja(svaDesavanja);
}

async function obrisiDesavanje() 
{
    let svaDesavanjaData = await axios.get("/api/svadesavanja");
    let svaDesavanja = svaDesavanjaData.data;
    svaDesavanja.forEach(async (desavanje) => {
        if(desavanje._id == sessionStorage.getItem("eventID")) 
        {
            await axios.delete(`/api/obrisi/${desavanje._id}`);
            document.location.href = "index.html";
        } 
    });
}

function napraviDesavanja(desavanja) 
{
    let desavanjaString = "<h2>Događaji</h2>";
    desavanja.forEach((event) => {
        desavanjaString += 
    `<div class="eventCardContainer" id="eventCardContainerID" onclick="otvoriDesavanje('${event._id}')">
        <table class="eventTable">
            <tr>
                <td class="eventTablecell" colspan="2" id="eventTableEventName">${event.naziv}</td>
            </tr>
            <tr>
                <td class="eventTablecell">Datum:</td>
                <td class="eventTablecell2" id="changeDate">${event.vreme}</td>
            </tr>
            <tr>
                <td class="eventTablecell">Mesto:</td>
                <td class="eventTablecell2" id="changePlace">${event.mesto}</td>
            </tr>
        </table>
    </div>`
    });
    desavanjaString += 
    `<form action="./eventCreation.html">
        <button class="submit-button" id="newEventButton">Novi dogadjaj</button>
    </form>`
    return desavanjaString;
}

async function kreirajDogadjaj() 
{
    const naziv = document.getElementById("nazivChange");
    const datum = document.getElementById("vremeChange");
    const mesto = document.getElementById("mestoChange");
    const opis = document.getElementById("opisChange");

    let zauzetNaziv = false;
    let svaDesavanjaData = await axios.get("/api/svadesavanja");
    let svaDesavanja = svaDesavanjaData.data;
    svaDesavanja.forEach((event) => {
        if(event.naziv == naziv) zauzetNaziv = true;
    });
    if(zauzetNaziv) prikaziError3("Već postoji događanje sa unetim nazivom!");
    else if(naziv.value.trim() == "" || datum.value.trim() == "" || mesto.value.trim() == "") prikaziError3("Sva polja moraju biti popunjena!");
    else 
    {
        if(naziv.length > 20) prikaziError3("Naziv ne sme imati više od 20 karaktera!");
        else 
        {
            if(mesto.length > 20) prikaziError("Zapis mesta ne sme imati više od 20 karaktera!");
            else 
            {
                let datumVrednost = new Date(datum.value);
                let danasnjiDatum = new Date();
                if(datumVrednost.getTime() < danasnjiDatum.getTime()) prikaziError3("Datum događaja mora biti u budućnosti!");
                else 
                {
                    let novoDesavanje = 
                    {
                        naziv: naziv.value,
                        vreme: datum.value,
                        mesto: mesto.value,
                        opis: opis.value,
                        idKreatora: localStorage.getItem("ID"),
                    }
                    await axios.post("/api/novodesavanje", novoDesavanje);
                    document.location.href = "index.html";
                }
            }
        }
    }
}

async function otvoriDesavanje(id) 
{
    sessionStorage.setItem("eventID", id);
    document.location.href = "eventpage.html";
}

async function eventStranicaLoad() 
{
    glavnaStranicaLoad();
    const id = sessionStorage.getItem("eventID");
    const naziv = document.getElementById("changeNaziv");
    const datum = document.getElementById("changeDate");
    const mesto = document.getElementById("changePlace");
    const opis = document.getElementById("changeOpis");
    let trazenoDesavanjeData = await axios.get("/api/svadesavanja");
    let trazenoDesavanje = trazenoDesavanjeData.data;
    trazenoDesavanje.forEach((event) => {
        if(event._id == id) 
        {
            naziv.innerHTML = event.naziv;
            datum.innerHTML = event.vreme;
            mesto.innerHTML = event.mesto;
            opis.innerHTML = event.opis;
            if(event.idKreatora == localStorage.getItem("ID")) document.getElementById("deleteButton").style.display = "inline-block";
            else document.getElementById("deleteButton").style.display = "none";
        }
    });
}

async function promeniPodatke() 
{
    let sviNaloziData = await axios.get("/api/svinalozi");
    let sviNalozi = sviNaloziData.data;
    sviNalozi.forEach(async (nalog) => {
        if(nalog._id == localStorage.getItem("ID")) 
        {
            let zauzetUsername = false;
            let zauzetEmail = false;

            let ime = document.getElementById("Ime").value;
            let prezime = document.getElementById("Prezime").value;
            let username = document.getElementById("Username").value;
            let email = document.getElementById("Email").value;
            let password = document.getElementById("Password").value;
            let rpassword = document.getElementById("RPassword").value;

            sviNalozi.forEach(async (nalog2) => {
                if(nalog2._id != nalog._id) 
                {
                    if(username == nalog2.username) zauzetUsername = true;
                    if(email == nalog2.email) zauzetEmail = true;
                }
            });
            if(zauzetUsername) prikaziError2("Uneto korisničko ime je već zauzeto.")
            else 
            {
                if(username.length > 20) prikaziError2("Korisničko ime maksimalno može imati 20 karaktera!")
                else if(zauzetEmail) prikaziError2("Uneti E-Mail je već zauzet.");
                else 
                {
                    if(!email.includes("@")) prikaziError2(`E-Mail mora sadržati "@"!`)
                    else 
                    {
                        if(!email.includes(".")) prikaziError2(`E-Mail mora sadržati "."!`)
                        else 
                        {
                            if(email.length > 32) prikaziError2("E-Mail ne može biti duži od 32 karaktera!");
                            if(rpassword.trim() != "") if(rpassword.length < 6) prikaziError2("Šifra mora sadržati barem 6 karaktera!");
                            else 
                            {
                                if(rpassword == rpassword.toLowerCase()) prikaziError2("Šifra mora sadržati barem jedno veliko slovo!");
                                else 
                                {
                                    let niz = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
                                    let sadrziBroj = false;
                                    niz.forEach((cifra) => {
                                        if(rpassword.includes(cifra)) sadrziBroj = true;
                                    });
                                    if(!sadrziBroj) prikaziError2("Šifra mora sadržati barem jednu cifru!");
                                    else 
                                    {
                                        if(password != nalog.password) prikaziError2("Stara šifra je netačna.");
                                        else 
                                        {
                                            let promenjenNalog = 
                                            {
                                                email: email,
                                                username: username,
                                                password: rpassword,
                                                ime: ime,
                                                prezime: prezime,
                                            }
                                            await axios.put(`/api/update/${nalog._id}`, promenjenNalog);
                                            document.location.href = "accountPage.html";
                                        }
                                    }
                                }
                            }
                            else 
                            {
                                if(password != nalog.password) prikaziError2("Stara šifra je netačna.");
                                else 
                                {
                                    let promenjenNalog = 
                                    {
                                        email: email,
                                        username: username,
                                        ime: ime,
                                        prezime: prezime,
                                    }
                                    await axios.put(`/api/update/${nalog._id}`, promenjenNalog);
                                    document.location.href = "accountPage.html";
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

async function nalogPodaci() 
{
    let svaDesavanjaData = await axios.get("/api/svadesavanja");
    let svaDesavanja = svaDesavanjaData.data;
    glavnaStranicaLoad();
    ucitajMojeDogadjaje(svaDesavanja);
    let sviNaloziData = await axios.get("/api/svinalozi");
    let sviNalozi = sviNaloziData.data;
    sviNalozi.forEach(async (nalog) => {
        if(nalog._id == localStorage.getItem("ID")) 
        {
            document.getElementById("usernameText").innerHTML = nalog.username;
            document.getElementById("emailText").innerHTML = nalog.email;
            document.getElementById("imeText").innerHTML = nalog.ime;
            document.getElementById("prezimeText").innerHTML = nalog.prezime;
            document.getElementById("Username").value = nalog.username;
            document.getElementById("Email").value = nalog.email;
            document.getElementById("Ime").value = nalog.ime;
            document.getElementById("Prezime").value = nalog.prezime;    
        }
    })
}

async function ucitajMojeDogadjaje(svaDesavanja) 
{
    const container = document.getElementById("accountCardContainerID");
    let mojaDesavanja = `<h2>Moji događaji</h2>`;
    svaDesavanja.forEach((desavanje) => {
        if(desavanje.idKreatora == localStorage.getItem("ID")) 
        {
            mojaDesavanja += 
            `
            <div class="eventCardContainer" onclick="otvoriDesavanje('${desavanje._id}')">
                <table class="eventTable">
                    <tr>
                        <td class="eventTablecell" colspan="2" id="eventTableEventName">${desavanje.naziv}</td>
                    </tr>
                    <tr>
                        <td class="eventTablecell">Datum:</td>
                        <td class="eventTablecell2" id="changeDate">${desavanje.vreme}</td>
                    </tr>
                <tr>
                        <td class="eventTablecell">Mesto:</td>
                        <td class="eventTablecell2" id="changePlace">${desavanje.mesto}</td>
                    </tr>
                </table>
            </div>
            `
        }
    });
    container.innerHTML = mojaDesavanja;
}

async function glavnaStranicaLoad() 
{
    let postoji = false;
    let sviNaloziData = await axios.get("api/svinalozi");
    let sviNalozi = sviNaloziData.data;
    sviNalozi.forEach((nalog) => {
        if(nalog._id == localStorage.getItem("ID")) postoji = true;
    });
    if(postoji) 
    {
        document.getElementById("createAcc-id").className += " hidden";
        document.getElementById("logAcc-id").className += " hidden";
    }
    else 
    {
        document.getElementById("accountButton-id").className += " hidden";
        if(document.location.href == "index.html") document.getElementById("newEventButton").className += " hidden";
    }
}

async function registracija() 
{
    const username = document.getElementById("Username").value;
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;
    const rpassword = document.getElementById("RPassword").value;
    const ime = document.getElementById("Ime").value;
    const prezime = document.getElementById("Prezime").value;

    let zauzetUsername = false;
    let zauzetEmail = false;
    let praznaPolja = false;
    
    let sviNaloziData = await axios.get("/api/svinalozi");
    let sviNalozi = sviNaloziData.data;
    sviNalozi.forEach((nalog) => {
        if(nalog.username == username) zauzetUsername = true;
        if(nalog.email == email) zauzetEmail = true;
    });

    if(email.trim() == "" || username.trim() == "" || ime.trim() == "" || prezime.trim() == "" || password.trim() == "") praznaPolja = true;

    if(praznaPolja) prikaziError("Sva polja moraju biti popunjena!");
    else if(zauzetUsername) 
    {
        prikaziError("Uneto korisničko ime je već zauzeto.");
    }
    else  
    {
        if(username.length > 20) prikaziError("Korisničko ime maksimalno može imati 20 karaktera!");
        else if(zauzetEmail) prikaziError("Uneti E-Mail je već zauzet.");
        else 
        {
            if(!email.includes("@")) prikaziError(`E-Mail mora sadržati "@"!`);
            else 
            {
                if(!email.includes(".")) prikaziError(`E-Mail mora sadržati "."!`);
                else 
                {
                    if(email.length > 32) prikaziError("E-Mail ne može biti duži od 32 karaktera!");
                    else if(password.length < 6) prikaziError("Šifra mora sadržati barem 6 karaktera!");
                    else 
                    {
                        if(password == password.toLowerCase()) prikaziError("Šifra mora sadržati barem jedno veliko slovo!");
                        else 
                        {
                            let niz = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
                            let sadrziBroj = false;
                            niz.forEach((cifra) => {
                                if(password.includes(cifra)) sadrziBroj = true;
                            });
                            if(!sadrziBroj) prikaziError("Šifra mora sadržati barem jednu cifru!");
                            else  
                            {
                                if(password != rpassword) prikaziError("Originalna i potvrđena šifra se moraju poklapati!");
                                else 
                                {
                                    let noviAccount = 
                                    {
                                        email: email,
                                        username: username,
                                        password: password,
                                        ime: ime,
                                        prezime: prezime,
                                    }
                                    let napravljenAccountData = await axios.post("/api/register", noviAccount);
                                    let napravljenAccount = napravljenAccountData.data;
                                    localStorage.setItem("ID", napravljenAccount._id)
                                    document.location.href = "index.html";
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

async function loginovanje() 
{
    let postoji = false;
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    let sviNaloziData = await axios.get("/api/svinalozi");
    sviNalozi = sviNaloziData.data;
    sviNalozi.forEach((nalog) => {
        if(nalog.username == username || nalog.email == username) 
        {
            postoji = true;
            if(nalog.password == password) 
            {
                localStorage.setItem("ID", nalog._id);
                document.getElementById("errorMessage").style.display = "none";
                document.location.href = "index.html";
            }
            else prikaziError("Netačna lozinka!")
        }
        else prikaziError("Ne postoji nalog sa unetim korisničkim imenom / E-Mail-om!");
    })
}

function prikaziError(poruka) 
{
    document.getElementById("errorMessage").innerHTML = poruka;
    document.getElementById("errorMessage").style.display = "block";
}

function prikaziError2(poruka) 
{
    document.getElementById("errorMessage2").innerHTML = poruka;
    document.getElementById("errorMessage2").style.display = "block";
}

function prikaziError3(poruka) 
{
    document.getElementById("errorMessage").innerHTML = poruka;
    document.getElementById("errorMessage").style.display = "block";
}