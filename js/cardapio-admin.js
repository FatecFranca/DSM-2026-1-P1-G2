const botao = document.getElementById("adicionar");

botao.addEventListener("click", () => {

  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;

  const cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];

  const novoProduto = {
    id: Date.now(1),
    nome,
    preco
  };

  cardapio.push(novoProduto);

  localStorage.setItem("cardapio", JSON.stringify(cardapio));

  carregarProdutos();

  alert("Produto adicionado!");
});

function carregarProdutos() {

  const cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];

  const lista = document.getElementById("lista-produtos");

  lista.innerHTML = "";

  cardapio.forEach(produto => {

    const div = document.createElement("div");

    div.classList.add("produto-admin");

    div.innerHTML = `
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
