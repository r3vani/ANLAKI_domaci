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

    if(!email.includes("@")) prikaziError(`E-Mail mora sadržati "@"!`);
    else 
    {
        if(password != rpassword) 
        {
            prikaziError(`Potvrđena šifra i originalna šifra se ne smeju razlikovati!`)
        }
        else 
        {
            let sadrziBroj = false;
            let niz = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            niz.forEach((element) => {
                if(password.includes(element)) sadrziBroj = true;
            });
            let sviNaloziData = await axios.get("/api/svinalozi");
            let sviNalozi = sviNaloziData.data;
            sviNalozi.forEach((nalog) => {
                if(nalog.username == username) zauzetUsername = true;
                if(nalog.email == email) zauzetEmail = true;
            });
            if(zauzetUsername) prikaziError("Uneto korisničko ime je već zauzeto!");
            else if(zauzetEmail) prikaziError("Uneti e-mail je već zauzet!");
            else if(password.length < 6) prikaziError("Šifra mora sadržati barem 6 karaktera!")
            else if(password.toLowerCase() == password) prikaziError("Šifra mora sadržati barem jedno veliko slovo!");
            else if(!sadrziBroj) prikaziError("Šifra mora sadržati barem jedan broj!");
            else 
            {
                let noviNalog = 
                {
                    email: email,
                    username: username,
                    password: password,
                    ime: ime,
                    prezime: prezime,
                }
                let sacuvanNalog = await axios.post("/api/register", noviNalog);
                document.getElementById("errorMessage").style.display = "none";
                localStorage.setItem("ID", sacuvanNalog.data._id);
                document.location.href = "index.html";
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