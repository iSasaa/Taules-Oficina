let usuari_id = null;
let usuari_nom = null; // Guarda el nom de l’usuari
let taula_seleccionada = null; // Guarda la taula seleccionada per l'usuari

// Funció per inicialitzar l'aplicació
function inicialitzarAplicacio() {
    inicialitzarCalendari();
    carregarReserves();
}

document.addEventListener("DOMContentLoaded", () => {
    const usuariInput = document.getElementById("usuari");
    const loginButton = document.getElementById("login-button");

    // Escoltar l'esdeveniment keydown per a l'input de l'usuari
    usuariInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            loginButton.click(); // Simula el clic del botó
        }
    });
});


function login() {
    let usuari = document.getElementById("usuari").value.trim();
    if (usuari === "") {
        document.getElementById("error-missatge").textContent = "Introdueix un nom d'usuari.";
        return;
    }

    fetch("login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuari })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            usuari_id = data.usuari_id;
            usuari_nom = usuari;
            document.getElementById("login-container").style.display = "none"; // Amaga el login
            document.getElementById("app-container").style.display = "flex";  // Mostra el calendari
            inicialitzarAplicacio(); // ← AFEGIT: Carregar el calendari després del login
        } else {
            document.getElementById("error-missatge").textContent = "Error en el registre.";
        }
    })
    .catch(error => console.error("Error:", error));
}


function logout() {
    usuari_id = null;
    usuari_nom = null;
    taula_seleccionada = null;

    document.getElementById("login-container").style.display = "block";
    document.getElementById("app-container").style.display = "none";
    document.getElementById("usuari").value = "";
}

function inicialitzarCalendari() {
    const avui = new Date(); // Data actual
    let mesActual = avui.getMonth();
    let anyActual = avui.getFullYear();

    function renderCalendari(mes, any) {
        const primerDiaMes = new Date(any, mes, 1);
        const diesAlMes = new Date(any, mes + 1, 0).getDate();
        const primerDiaSetmana = primerDiaMes.getDay() === 0 ? 7 : primerDiaMes.getDay();

        const calendari = document.getElementById("custom-calendar");
        calendari.innerHTML = ""; // Neteja el contingut del calendari

        // Actualitza el text del mes i l'any
        const mesAnyText = document.querySelector(".calendar-header span");
        mesAnyText.textContent = `${mes + 1}/${any}`;

        // Afegeix els noms dels dies de la setmana
        const diesSetmana = ["Dll", "Dm", "Dc", "Dj", "Dv", "Ds", "Dg"];
        diesSetmana.forEach(dia => {
            const diaSetmanaElement = document.createElement("div");
            diaSetmanaElement.classList.add("header");
            diaSetmanaElement.textContent = dia;
            calendari.appendChild(diaSetmanaElement);
        });

        // Afegeix placeholders per a dies abans del primer dia del mes
        const placeholders = primerDiaSetmana === 0 ? 6 : primerDiaSetmana - 1;
        for (let i = 0; i < placeholders; i++) {
            const placeholder = document.createElement("div");
            placeholder.classList.add("placeholder");
            calendari.appendChild(placeholder);
        }

        // Afegeix els dies del mes
        for (let dia = 1; dia <= diesAlMes; dia++) {
            const diaElement = document.createElement("div");
            diaElement.textContent = dia;

            const dataActual = new Date(any, mes, dia).setHours(0, 0, 0, 0);
            const avuiSenseHores = avui.setHours(0, 0, 0, 0);

            if (dataActual < avuiSenseHores) {
                diaElement.classList.add("past"); // Dies passats
            } else {
                diaElement.classList.add("future"); // Dies futurs
                diaElement.addEventListener("click", () => seleccionarDia(dia));
            }

            // Marca el dia actual amb "future selected"
            if (
                any === avui.getFullYear() &&
                mes === avui.getMonth() &&
                dia === avui.getDate()
            ) {
                diaElement.classList.add("selected"); // Marca com seleccionat
            }

            calendari.appendChild(diaElement);
        }
    }

    // Comprovar si la barra de navegació ja existeix
    if (!document.querySelector(".calendar-header")) {
        const header = document.createElement("div");
        header.classList.add("calendar-header");

        const anterior = document.createElement("button");
        anterior.textContent = "◀";
        anterior.addEventListener("click", () => {
            mesActual--;
            if (mesActual < 0) {
                mesActual = 11;
                anyActual--;
            }
            renderCalendari(mesActual, anyActual);
        });

        const seguent = document.createElement("button");
        seguent.textContent = "▶";
        seguent.addEventListener("click", () => {
            mesActual++;
            if (mesActual > 11) {
                mesActual = 0;
                anyActual++;
            }
            renderCalendari(mesActual, anyActual);
        });

        const mesAnyText = document.createElement("span");
        mesAnyText.textContent = `${mesActual + 1}/${anyActual}`;
        mesAnyText.style.fontWeight = "bold";

        header.appendChild(anterior);
        header.appendChild(mesAnyText);
        header.appendChild(seguent);

        const container = document.getElementById("calendar-container");
        container.insertBefore(header, container.firstChild);
    }

    renderCalendari(mesActual, anyActual);
}


function seleccionarDia(dia) {
    const dies = document.querySelectorAll("#custom-calendar .future");
    dies.forEach(diaElement => diaElement.classList.remove("selected")); // Elimina seleccions anteriors
    const diaSeleccionat = [...dies].find(diaElement => diaElement.textContent == dia);
    diaSeleccionat.classList.add("selected");

    carregarReserves(); // Carrega les reserves per al dia seleccionat
}


function carregarReserves() {
    const dataSeleccionada = document.querySelector("#custom-calendar .selected");
    if (!dataSeleccionada) return;

    const dia = dataSeleccionada.textContent;
    const avui = new Date();
    const mes = avui.getMonth() + 1; // Els mesos comencen en 0
    const any = avui.getFullYear();
    const data = `${any}-${mes.toString().padStart(2, "0")}-${dia.padStart(2, "0")}`;

    fetch(`get_reserves.php?data=${data}`)
        .then(resposta => resposta.json())
        .then(reserves => {
            taula_seleccionada = null; // Reiniciem la selecció

            document.querySelectorAll(".quadrat").forEach(quadrat => {
                quadrat.classList.remove("seleccionat", "reservat");
                quadrat.onclick = null;

                const taula = quadrat.getAttribute("data-taula");
                const reservaUsuari = reserves.find(r => r.taula == taula && r.usuari_id == usuari_id);
                const reservaAltres = reserves.find(r => r.taula == taula && r.usuari_id != usuari_id);

                if (reservaUsuari) {
                    quadrat.classList.add("seleccionat");
                    quadrat.textContent = usuari_nom; // Mostra el nom de l’usuari a la taula
                    taula_seleccionada = taula; // Guarda la taula seleccionada
                    quadrat.onclick = () => reservarTaula(taula);
                } else if (reservaAltres) {
                    quadrat.classList.add("reservat");
                    quadrat.textContent = reservaAltres.usuari; // Mostra el nom de l’altre usuari
                } else {
                    quadrat.textContent = getNomCiutat(taula); // Assigna el nom original de la ciutat
                    quadrat.onclick = () => reservarTaula(taula);
                }
            });
        });
}

function reservarTaula(taula) {
    const dataSeleccionada = document.querySelector("#custom-calendar .selected");
    if (!dataSeleccionada) {
        alert("Selecciona una data!");
        return;
    }

    const dia = dataSeleccionada.textContent.padStart(2, "0");
    const avui = new Date();
    const mes = (avui.getMonth() + 1).toString().padStart(2, "0");
    const any = avui.getFullYear();
    const data = `${any}-${mes}-${dia}`;



    if (String(taula_seleccionada) === String(taula)) {
        fetch("cancelar_reserva.php", {
            method: "POST",
            body: JSON.stringify({ usuari_id, data, taula: taula_seleccionada }),
            headers: { "Content-Type": "application/json" }
        })
        .then(resposta => resposta.json())
        .then(result => {
            if (result.success) {
                taula_seleccionada = null; // Desseleccionem la taula
                carregarReserves(); // Recarreguem les dades
            } else {
                alert(result.message);
            }
        });
        return; // Si és la mateixa taula, no fem res més
    }

    // Fem la nova reserva
    fetch("reservar.php", {
        method: "POST",
        body: JSON.stringify({ usuari_id, data, taula }),
        headers: { "Content-Type": "application/json" }
    })
    .then(resposta => resposta.json())
    .then(result => {
        if (result.success) {
            taula_seleccionada = taula; // Actualitzem la taula seleccionada
            carregarReserves(); // Recarreguem les dades
        } else {
            alert(result.message);
        }
    });
}




function getNomCiutat(taula) {
    const ciutats = [
        "Vidreres", "París", "Chicago", "Londres", "Nova York", "Florencia", "Buenos Aires", "Lisboa",
        "El Caire", "Quebec", "Amsterdam", "Berlín", "Atenes", "L'Havana", "San Francisco",
        "Kàtmandu", "Praga", "Toquio", "Madrid", "Copenhaguen", "Roma",
        "Dubai", "Rio de Janeiro"
    ];
    return ciutats[taula - 1];
}
