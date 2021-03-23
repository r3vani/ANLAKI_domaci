async function registracija() 
{
    const username = document.getElementById("Username").value;
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;
    const rpassword = document.getElementById("RPassword").value;
    const ime = document.getElementById("Ime").value;
    const prezime = document.getElementById("Prezime").value;
    if(email.includes("@")) 
    {
        if(password.length > 5) 
        {
            if(password == rpassword) 
            {
                const noviNalog = 
                {
                    email: email,
                    username: username,
                    password: password,
                    ime: ime,
                    prezime: prezime,
                }
                let registracijaRequest = await axios.post("/api/register", noviNalog);
                console.log(registracijaRequest);
            }
            else 
            {
                alert("Ponovljena sifra nije ista kao originalna sifra.");
            }
        }
        else 
        {
            alert("Password mora biti duzi od 5 karaktera!")
        }
    }
    else 
    {
        alert(`E-Mail mora sadrzati "@"!`);
    }
    let registracijaRequest = axios.post();
}