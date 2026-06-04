let carrinho = [];

function carregarCardapio() {
  const cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];

  const div = document.getElementById("cardapio");

  div.innerHTML = "";

  cardapio.forEach(produto => {

    const item = document.createElement("div");

    item.classList.add("card-produto");

    item.innerHTML = `
      <img src="https://picsum.photos/300/200?random=${produto.id}" alt="${produto.nome}">

      <div class="info-produto">
        <h3>${produto.nome}</h3>

        <p class="preco">
          ${produto.preco}
        </p>

        <button onclick="adicionarCarrinho(${produto.id})">
          Adicionar ao carrinho
        </button>
      </div>
    `;

    div.appendChild(item);
  });
}

function adicionarCarrinho(id) {

  const cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];

  const produto = cardapio.find(p => p.id === id);

  carrinho.push(produto);

  atualizarCarrinho();
}

function atualizarCarrinho() {

  const div = document.getElementById("carrinho");

  div.innerHTML = "";

  carrinho.forEach(item => {

    const produto = document.createElement("div");

    produto.innerHTML = `
      ${item.nome} - ${item.preco}
    `;

    div.appendChild(produto);
  });
}

document.getElementById("finalizar").addEventListener("click", () => {

  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  const numeroPedido =
  String(pedidos.length + 1).padStart(3, "0");

  const pedido = {
    numero: numeroPedido,
    itens: carrinho,
    status: "Pendente"
  };

  pedidos.push(pedido);

  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  alert("Pedido enviado!");

  carrinho = [];

  atualizarCarrinho();
});

carregarCardapio();

setInterval(carregarCardapio, 3000);
