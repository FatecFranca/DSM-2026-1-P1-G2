const botao = document.getElementById("adicionar");
const fileInput = document.getElementById("imagemProduto");
const previewProduto = document.getElementById("previewProduto");

fileInput.addEventListener("change", () => {
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      previewProduto.src = reader.result;
      previewProduto.style.display = "block";
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    previewProduto.src = "";
    previewProduto.style.display = "none";
  }
});

botao.addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const preco = document.getElementById("preco").value.trim();

  if (!nome || !preco) {
    alert("Preencha o nome e o preço do produto.");
    return;
  }

  const cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];
  const novoProduto = {
    id: Date.now(),
    nome,
    preco,
    imagem: null
  };

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      novoProduto.imagem = reader.result;
      salvarProduto(novoProduto);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    salvarProduto(novoProduto);
  }
});

function salvarProduto(produto) {
  const cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];
  cardapio.push(produto);
  localStorage.setItem("cardapio", JSON.stringify(cardapio));
  carregarProdutos();
  limparFormulario();
  alert("Produto adicionado!");
}

function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  fileInput.value = "";
  previewProduto.src = "";
  previewProduto.style.display = "none";
}

function carregarProdutos() {

  const cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];

  const lista = document.getElementById("lista-produtos");

  lista.innerHTML = "";

  cardapio.forEach(produto => {

    const div = document.createElement("div");

    div.classList.add("produto-admin");

    div.innerHTML = `
      ${produto.imagem ? `<img src="${produto.imagem}" alt="Imagem do ${produto.nome}" class="produto-imagem">` : ""}
      <h3>${produto.nome}</h3>
      <p>${produto.preco}</p>
      <button onclick="removerProduto(${produto.id})">
        Excluir
      </button>
    `;

    lista.appendChild(div);
  });
}

function removerProduto(id) {

  let cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];

  cardapio = cardapio.filter(produto => produto.id !== id);

  localStorage.setItem("cardapio", JSON.stringify(cardapio));

  carregarProdutos();
}

function carregarPedidos() {

  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  const div = document.getElementById("pedidos");

  div.innerHTML = "";

  pedidos.forEach(pedido => {

    const pedidoDiv = document.createElement("div");

    pedidoDiv.classList.add("pedido-admin");

    pedidoDiv.innerHTML = `
      <h3>Pedido #${pedido.numero}</h3>

      <p>Status: ${pedido.status}</p>

      <hr>

      ${pedido.itens.map(item => `
        <p>${item.nome} - ${item.preco}</p>
      `).join("")}
    `;

    div.appendChild(pedidoDiv);
  });
}

carregarProdutos();

carregarPedidos();

setInterval(carregarPedidos, 3000);
