
function formatarCNPJ(input) {
  let valor = input.value.replace(/\D/g, ''); 

  if (valor.length <= 2) {
    input.value = valor;
  } else if (valor.length <= 5) {
    input.value = valor.slice(0, 2) + '.' + valor.slice(2);
  } else if (valor.length <= 9) {
    input.value = valor.slice(0, 2) + '.' + valor.slice(2, 5) + '.' + valor.slice(5);
  } else if (valor.length <= 13){
    input.value = valor.slice(0, 2) + '.' + valor.slice(2, 5) + '.' + valor.slice(5, 8) + '/' + valor.slice(8, 13);
  } else {
    input.value = valor.slice(0, 2) + '.' + valor.slice(2, 5) + '.' + valor.slice(5, 8) + '/' + valor.slice(8, 12) + '-' + valor.slice(12, 15);
  }
}

function cadastrarRestaurante() {

  const nomeR = document.getElementById("inputNomeR").value;
  const emailR = document.getElementById("inputEmailR").value;
  const cnpj = document.getElementById("inputCNPJ").value;
  const desc = document.getElementById("inputDesc").value;

  if (nomeR === "" || emailR === "" || cnpj === "") {
    alert("Preencha todos os campos!");
    return;
  }

  let estabelecimentos =
    JSON.parse(localStorage.getItem("estabelecimentos")) || [];

  const restaurante = {
    nomeR,
    emailR,
    cnpj,
    desc
  };

  estabelecimentos.push(restaurante);

  localStorage.setItem(
    "estabelecimentos",
    JSON.stringify(estabelecimentos)
  );

  alert("Resaurante cadastrado!");

  window.location.href = "admin-login.html";
}

function loginRestaurante() {

  const emailR =
    document.getElementById("loginEmail").value;

  const cnpj =
    document.getElementById("loginCPF").value;

  const estabelecimentos =
    JSON.parse(localStorage.getItem("estabelecimentos")) || [];

  const restauranteEncontrado = estabelecimentos.find(restaurante =>
    restaurante.emailR === emailR &&
    restaurante.cnpj === cnpj
  );

  if (restauranteEncontrado) {

    localStorage.setItem("logado", "true");

    localStorage.setItem(
      "restauranteAtual",
      JSON.stringify(usuarioEncontrado)
    );

    alert("Login realizado!");

    window.location.href = "cardapio-admin.html";

  } else {

    alert("Dados incorretos.");

  }
}