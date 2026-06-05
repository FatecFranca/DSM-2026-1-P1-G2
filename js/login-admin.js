
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

function gerarCodigo(nomeR) {
  const prefixo = nomeR.toUpperCase().replace(/\s/g, "").slice(0, 4);
  const numeros = Math.floor(1000 + Math.random() * 9000); // sempre 4 dígitos
  return `${prefixo}-${numeros}`;
}

function cadastrarRestaurante() {

  const nomeR = document.getElementById("inputNomeR").value;
  const emailR = document.getElementById("inputEmailR").value;
  const cnpj = document.getElementById("inputCNPJ").value;

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
    codigo: gerarCodigo(nomeR)
  };

  estabelecimentos.push(restaurante);

  localStorage.setItem(
    "estabelecimentos",
    JSON.stringify(estabelecimentos)
  );

  alert(`Restaurante cadastrado!\n\nSeu código de acesso ao cardápio: ${restaurante.codigo}\n\nGuarde esse código!`);

  window.location.href = "admin-login.html";
}

function loginRestaurante() {

  const emailR =
    document.getElementById("loginEmail").value;

  const cnpj =
    document.getElementById("loginCNPJ").value;

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
      JSON.stringify(restauranteEncontrado)
    );

    alert("Login realizado!");

    window.location.href = "perfil-restaurante.html";

  } else {

    alert("Dados incorretos.");

  }
}

