const registros = JSON.parse(localStorage.getItem("registros")) || [];

let registroEditado = -1;

const splash = document.getElementById("splashScreen");
const home = document.getElementById("homeScreen");
const modal = document.getElementById("modalOverlay");

const campoData = document.getElementById("recordDate");
const campoQuantidade = document.getElementById("quantity");
const campoPeso = document.getElementById("weight");

document.getElementById("enterButton").onclick = function() {
    splash.classList.add("hidden");
    home.classList.remove("hidden");
    atualizarTela();
};

document.getElementById("backButton").onclick = function() {
    home.classList.add("hidden");
    splash.classList.remove("hidden");
};

document.getElementById("themeToggle").onchange = function() {
    document.body.classList.toggle("dark");
};

document.getElementById("addButton").onclick = function() {
    registroEditado = -1;

    document.getElementById("modalTitle").innerText =
        "Adicionar consumo";

    campoData.value = pegarData();
    campoQuantidade.value = "";
    campoPeso.value = "";

    modal.classList.remove("hidden");
};

document.getElementById("closeModal").onclick = fecharModal;
document.getElementById("cancelButton").onclick = fecharModal;

function fecharModal() {
    modal.classList.add("hidden");
}

document.getElementById("waterForm").onsubmit = function(evento) {
    evento.preventDefault();

    let registro = {
        data: campoData.value,
        quantidade_em_ml: Number(campoQuantidade.value),
        peso_atual_kg: Number(campoPeso.value)
    };

    if (
        registro.data == "" ||
        registro.quantidade_em_ml <= 0 ||
        registro.peso_atual_kg <= 0
    ) {
        alert("Preencha os campos corretamente.");
        return;
    }

    if (registroEditado == -1) {
        registros.push(registro);
    } else {
        registros[registroEditado] = registro;
    }

    salvarRegistros();
    fecharModal();
    atualizarTela();
};

function salvarRegistros() {
    localStorage.setItem(
        "registros",
        JSON.stringify(registros)
    );
}

function pegarData() {
    let data = new Date();

    let ano = data.getFullYear();
    let mes = String(data.getMonth() + 1).padStart(2, "0");
    let dia = String(data.getDate()).padStart(2, "0");

    return ano + "-" + mes + "-" + dia;
}

function formatarData(data) {
    let partes = data.split("-");

    return partes[2] + "/" +
        partes[1] + "/" +
        partes[0];
}

function atualizarTela() {
    mostrarRegistros();
    mostrarResumo();
}

function mostrarRegistros() {
    const lista =
        document.getElementById("recordsContainer");

    lista.innerHTML = "";

    document.getElementById("emptyState")
        .classList.toggle(
            "hidden",
            registros.length > 0
        );

    registros.forEach(function(registro, index) {

        let card = document.createElement("div");

        card.className = "record-card";

        card.innerHTML = `
            <div class="record-date">
                ${formatarData(registro.data)}
            </div>

            <div class="record-quantity">
                ${registro.quantidade_em_ml} ml
            </div>

            <div class="record-weight">
                Peso: ${registro.peso_atual_kg} kg
            </div>

            <button class="delete-button">×</button>
        `;

        card.onclick = function() {
            editarRegistro(index);
        };

        let botaoExcluir =
            card.querySelector(".delete-button");

        botaoExcluir.onclick = function(evento) {
            evento.stopPropagation();

            if (confirm("Deseja excluir este registro?")) {
                registros.splice(index, 1);
                salvarRegistros();
                atualizarTela();
            }
        };

        lista.appendChild(card);
    });

    document.getElementById("recordCount").innerText =
        registros.length + " registros";
}

function editarRegistro(index) {
    registroEditado = index;

    let registro = registros[index];

    document.getElementById("modalTitle").innerText =
        "Editar consumo";

    campoData.value = registro.data;
    campoQuantidade.value =
        registro.quantidade_em_ml;
    campoPeso.value =
        registro.peso_atual_kg;

    modal.classList.remove("hidden");
}

function mostrarResumo() {
    let total = 0;
    let peso = 0;
    let dataAtual = pegarData();

    registros.forEach(function(registro) {

        if (registro.data == dataAtual) {
            total += registro.quantidade_em_ml;
            peso = registro.peso_atual_kg;
        }

    });

    let meta = peso * 35;
    let porcentagem = 0;

    if (meta > 0) {
        porcentagem = total / meta * 100;
    }

    document.getElementById("totalToday").innerText =
        total + " ml";

    document.getElementById("dailyGoal").innerText =
        meta + " ml";

    document.getElementById("percentage").innerText =
        porcentagem.toFixed(1) + "%";

    document.getElementById("progressBar").style.width =
        Math.min(porcentagem, 100) + "%";
}

atualizarTela();