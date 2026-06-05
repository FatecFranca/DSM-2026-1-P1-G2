const categorias = [
  "Pizzaria", "Lanchonete", "Comida Japonesa", "Churrascaria",
  "Hamburgueria", "Comida Italiana", "Comida Árabe",
  "Comida Mexicana", "Frutos do Mar", "Vegetariano/Vegano", "Outro"
];

function carregarPerfil() {
  const restaurante = JSON.parse(localStorage.getItem("restauranteAtual"));
  if (!restaurante) {
    window.location.href = "admin-login.html";
    return;
  }
  document.getElementById("nRest").textContent = restaurante.nomeR.toUpperCase() || "";

  // Preenche o select de categorias
  const select = document.getElementById("perfilCategoria");
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (restaurante.categoria === cat) option.selected = true;
    select.appendChild(option);
  });

  // Preenche os campos
  document.getElementById("perfilNome").value = restaurante.nomeR || "";
  document.getElementById("perfilDesc").value = restaurante.desc || "";

  // Preview da logo
  if (restaurante.logo) {
    document.getElementById("previewLogo").src = restaurante.logo;
    document.getElementById("previewLogo").style.display = "block";
  }

  // Começa com campos desabilitados
  toggleEdicao(false);
}

function toggleEdicao(habilitar) {
  const campos = ["perfilNome", "perfilDesc", "perfilCategoria"];
  campos.forEach(id => {
    document.getElementById(id).disabled = !habilitar;
  });
  document.getElementById("inputLogo").disabled = !habilitar;

  document.getElementById("btnAlterar").style.display = habilitar ? "none" : "inline-block";
  document.getElementById("btnSalvar").style.display = habilitar ? "inline-block" : "none";
  document.getElementById("btnCancelar").style.display = habilitar ? "inline-block" : "none";
}

function alterarPerfil() {
  toggleEdicao(true);
}

function cancelarEdicao() {
  carregarPerfil(); // Restaura os valores originais
  toggleEdicao(false);
}

function salvarPerfil() {
  const nomeR = document.getElementById("perfilNome").value.trim();
  const desc = document.getElementById("perfilDesc").value.trim();
  const categoria = document.getElementById("perfilCategoria").value;

  if (!nomeR) {
    alert("O nome do restaurante não pode estar vazio!");
    return;
  }

  const restauranteAtual = JSON.parse(localStorage.getItem("restauranteAtual"));

  // Atualiza logo se enviou uma nova
  const fileInput = document.getElementById("inputLogo");
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      finalizarSalvamento(restauranteAtual, nomeR, desc, categoria, e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    finalizarSalvamento(restauranteAtual, nomeR, desc, categoria, restauranteAtual.logo || null);
  }
}

function finalizarSalvamento(restauranteAtual, nomeR, desc, categoria, logo) {
  const restauranteAtualizado = {
    ...restauranteAtual,
    nomeR,
    desc,
    categoria,
    logo
  };

  // Atualiza restauranteAtual
  localStorage.setItem("restauranteAtual", JSON.stringify(restauranteAtualizado));

  // Atualiza também no array de estabelecimentos
  const estabelecimentos = JSON.parse(localStorage.getItem("estabelecimentos")) || [];
  const index = estabelecimentos.findIndex(r => r.cnpj === restauranteAtual.cnpj);
  if (index !== -1) {
    estabelecimentos[index] = restauranteAtualizado;
    localStorage.setItem("estabelecimentos", JSON.stringify(estabelecimentos));
  }

  // Atualiza preview da logo
  if (logo) {
    document.getElementById("previewLogo").src = logo;
    document.getElementById("previewLogo").style.display = "block";
  }

  toggleEdicao(false);
  alert("Perfil atualizado!");
}

function previewImagem(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("previewLogo");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

window.onload = carregarPerfil;