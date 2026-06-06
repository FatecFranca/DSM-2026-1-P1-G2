let carrinho = [];
const tabButtons = document.querySelectorAll('.menu-list button');

function mudarAba(id) {
  document.querySelectorAll('.tab-section').forEach(section => section.classList.remove('active'));
  document.querySelectorAll('.menu-list button').forEach(button => button.classList.remove('active'));
  const target = document.getElementById(id);
  const button = document.querySelector(`.menu-list button[data-target="${id}"]`);
  if (target) target.classList.add('active');
  if (button) button.classList.add('active');

  if (id === 'checkout-section') {
    atualizarCheckout();
  }
}

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    mudarAba(button.dataset.target);
  });
});

function carregarCardapio() {
  const cardapio = JSON.parse(localStorage.getItem('cardapio')) || [];
  const div = document.getElementById('cardapio');
  div.innerHTML = '';

  cardapio.forEach(produto => {
    const item = document.createElement('div');
    item.classList.add('card-produto');
    item.innerHTML = `
      <img src="${produto.imagem || `https://picsum.photos/300/200?random=${produto.id}`}" alt="${produto.nome}">

      <div class="info-produto">
        <h3>${produto.nome}</h3>
        <p class="descricao">${produto.descricao}</p>
        <p class="preco">${produto.preco}</p>
        <button onclick="adicionarCarrinho(${produto.id})">Adicionar ao carrinho</button>
      </div>
    `;
    div.appendChild(item);
  });
}

function adicionarCarrinho(id) {
  const cardapio = JSON.parse(localStorage.getItem('cardapio')) || [];
  const produto = cardapio.find(p => p.id === id);
  if (!produto) return;
  carrinho.push(produto);
  atualizarCarrinho();
  alert('Produto adicionado ao carrinho!');
}

function atualizarContadorCarrinho() {
  const contador = document.getElementById('contador-carrinho');

  if (contador) {
    contador.textContent = carrinho.length;
  }
}

function atualizarCarrinho() {
    const div = document.getElementById('carrinho');
    div.innerHTML = '';

    atualizarContadorCarrinho();

    if (carrinho.length === 0) {
        div.innerHTML = '<p class="carrinho-vazio">O carrinho está vazio.</p>';
        return;
    }

    // Renderiza os itens
    carrinho.forEach((item, index) => {
        const produto = document.createElement('div');
        produto.classList.add('item-carrinho'); 

        produto.innerHTML = `
            <div class="detalhes-produto">
                <span class="nome-produto">${item.nome}</span>
                <span class="preco-produto">R$ ${item.preco}</span>
            </div>
            <button class="btn-remover" onclick="removerCarrinho(${index})">
                ❌
            </button>
        `;

        div.appendChild(produto);
    });

    // Injeta o botão de finalizar bonito
    const containerBotao = document.createElement('div');
    containerBotao.style.display = 'flex';
    containerBotao.style.justify = 'center'; /* Centraliza o botão */
    containerBotao.style.width = '100%';
    containerBotao.style.padding = '10px 0'; 
    containerBotao.style.background = 'none';
    
    containerBotao.innerHTML = `
        <button id="finalizar" class="btn-finalizar-pedido">
            Finalizar Pedido <span class="seta-btn">→</span>
        </button>
    `;
    
    div.appendChild(containerBotao);

    // Evento do botão de finalizar
    document.getElementById('finalizar').addEventListener('click', () => {
        mudarAba('checkout-section');
    });
}

function removerCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

 

function atualizarCheckout() {
  const lista = document.getElementById('checkout-items');
  const total = document.querySelector('.checkout-total');
  lista.innerHTML = '';

  if (carrinho.length === 0) {
    lista.innerHTML = '<li>Não há itens no carrinho.</li>';
    total.textContent = 'Total: R$ 0,00';
    return;
  }

  let soma = 0;
  carrinho.forEach(item => {
    const preco = Number(String(item.preco).replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;
    soma += preco;
    const li = document.createElement('li');
    li.textContent = `${item.nome} - ${item.preco}`;
    lista.appendChild(li);
  });

  total.textContent = `Total: R$ ${soma.toFixed(2)}`;
}

document.getElementById('confirmar-pagamento').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert('O carrinho está vazio.');
    return;
  }

  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const numeroPedido = String(pedidos.length + 1).padStart(3, '0');
  const pedido = {
    numero: numeroPedido,
    itens: carrinho,
    status: 'Pendente'
  };

  pedidos.push(pedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));

  alert('Pagamento confirmado! Pedido enviado.');
  carrinho = [];
  atualizarCarrinho();
  mudarAba('cardapio-section');
});

carregarCardapio();
atualizarCarrinho();
setInterval(carregarCardapio, 3000);
