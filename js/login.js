function formatarCPF(input) {
  let valor = input.value.replace(/\D/g, '');

  if (valor.length <= 3) {
    input.value = valor;
  } else if (valor.length <= 6) {
    input.value = valor.slice(0, 3) + '.' + valor.slice(3);
  } else if (valor.length <= 9) {
    input.value = valor.slice(0, 3) + '.' + valor.slice(3, 6) + '.' + valor.slice(6);
  } else {
    input.value = valor.slice(0, 3) + '.' + valor.slice(3, 6) + '.' + valor.slice(6, 9) + '-' + valor.slice(9, 11);
  }
} s

function cadastrar() {

  const nome = document.getElementById("inputNome").value;
  const email = document.getElementById("inputEmail").value;
  const cpf = document.getElementById("inputCPF").value;

  if (nome === "" || email === "" || cpf === "") {
    alert("Preencha todos os campos!");
    return;
  }

  let usuarios =
    JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuario = {
    nome,
    email,
    cpf
  };

  usuarios.push(usuario);

  localStorage.setItem(
    "usuarios",
    JSON.stringify(usuarios)
  );

  alert("Usuário cadastrado!");

  window.location.href = "user-login.html";
}

function login() {

  const email =
    document.getElementById("loginEmail").value;

  const cpf =
    document.getElementById("loginCPF").value;

  const usuarios =
    JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioEncontrado = usuarios.find(usuario =>
    usuario.email === email &&
    usuario.cpf === cpf
  );

  if (usuarioEncontrado) {

    localStorage.setItem("logado", "true");

    localStorage.setItem(
      "usuarioAtual",
      JSON.stringify(usuarioEncontrado)
    );

    alert("Login realizado!");

    window.location.href = "usercod.html";

  } else {

    alert("Dados incorretos.");

  }
}

