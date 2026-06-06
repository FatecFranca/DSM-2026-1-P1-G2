const restauranteCliente = JSON.parse(localStorage.getItem('restauranteCliente'));
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

  if (!restauranteCliente) {
    div.innerHTML = '<p class="mensagem-erro">Restaurante não encontrado. Faça login novamente.</p>';
    return;
  }

  const produtosRestaurante = cardapio.filter(produto => produto.restauranteCnpj === restauranteCliente.cnpj);

  if (produtosRestaurante.length === 0) {
    div.innerHTML = '<p class="carrinho-vazio">O cardápio deste restaurante ainda não foi publicado.</p>';
    return;
  }

  produtosRestaurante.forEach(produto => {
    const item = document.createElement('div');
    item.classList.add('card-produto');
    item.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">

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

function prepararRestaurante() {
  if (!restauranteCliente) {
    alert('Restaurante não encontrado. Faça login novamente.');
    window.location.href = 'usercod.html';
    return;
  }

  const header = document.getElementById('restaurante-header');
  if (header) {
    header.innerHTML = `
      <div class="restaurante-info">
        <h3>${restauranteCliente.nomeR}</h3>
        <p>Cardápio e pedidos do restaurante ${restauranteCliente.nomeR}</p>
      </div>
    `;
  }

  carregarPedidosRestaurante();
}

function carregarPedidosRestaurante() {
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const div = document.getElementById('restaurante-pedidos');

  if (!div) return;

  const pedidosFiltrados = restauranteCliente
    ? pedidos.filter(pedido => pedido.restauranteCnpj === restauranteCliente.cnpj)
    : [];

  if (pedidosFiltrados.length === 0) {
    div.innerHTML = '<p class="sem-pedidos">Nenhum pedido recebido para este restaurante ainda.</p>';
    return;
  }

  div.innerHTML = '<h3>Pedidos Recebidos</h3>';
  pedidosFiltrados.forEach(pedido => {
    const pedidoDiv = document.createElement('div');
    pedidoDiv.classList.add('pedido-cliente');
    pedidoDiv.innerHTML = `
      <h4>Pedido #${pedido.numero}</h4>
      <p>Status: ${pedido.status}</p>
      <ul>
        ${pedido.itens.map(item => `<li>${item.nome} - ${item.preco}</li>`).join('')}
      </ul>
    `;
    div.appendChild(pedidoDiv);
  });
}

function adicionarCarrinho(id) {
  const cardapio = JSON.parse(localStorage.getItem('cardapio')) || [];
  const produto = cardapio.find(p => p.id === id);
  if (!produto) return;
  carrinho.push(produto);
  atualizarCarrinho();
  mostrarModalAdicionado(produto.nome);
}

function mostrarModalAdicionado(nomeProduto) {
  const existente = document.getElementById('modal-carrinho');
  if (existente) existente.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-carrinho';
  modal.innerHTML = `
    <div class="modal-icone">🛒</div>
    <div class="modal-texto">
      <strong>${nomeProduto}</strong>
      <span>adicionado ao carrinho!</span>
    </div>
  `;
  document.body.appendChild(modal);

  requestAnimationFrame(() => modal.classList.add('visivel'));

  setTimeout(() => {
    modal.classList.remove('visivel');
    modal.addEventListener('transitionend', () => modal.remove(), { once: true });
  }, 2500);
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

    const containerBotao = document.createElement('div');
    containerBotao.style.display = 'flex';
    containerBotao.style.justify = 'center'; 
    containerBotao.style.width = '100%';
    containerBotao.style.padding = '10px 0'; 
    containerBotao.style.background = 'none';
    
    containerBotao.innerHTML = `
        <button id="finalizar" class="btn-finalizar-pedido">
            Finalizar Pedido <span class="seta-btn">→</span>
        </button>
    `;
    
    div.appendChild(containerBotao);

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

function atualizarMetodoPagamento() {
  const metodoBtn = document.querySelector('.payment-method-btn.active');
  const metodo = metodoBtn?.dataset.method || 'pix';
  const pixInfo = document.getElementById('pix-info');
  const cardInfo = document.getElementById('card-info');

  if (!pixInfo || !cardInfo) return;

  if (metodo === 'card') {
    pixInfo.style.display = 'none';
    cardInfo.style.display = 'block';
  } else {
    pixInfo.style.display = 'block';
    cardInfo.style.display = 'none';
  }
}

document.querySelectorAll('.payment-method-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    atualizarMetodoPagamento();
  });
});

atualizarMetodoPagamento();

document.getElementById('confirmar-pagamento').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert('O carrinho está vazio.');
    return;
  }

  const metodoPagamento = document.querySelector('.payment-method-btn.active')?.dataset.method || 'pix';
  if (metodoPagamento === 'card') {
    const cardNumber = document.getElementById('card-number').value.trim();
    const cardName = document.getElementById('card-name').value.trim();
    const cardExpiry = document.getElementById('card-expiry').value.trim();
    const cardCvv = document.getElementById('card-cvv').value.trim();
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      alert('Preencha os dados do cartão para continuar.');
      return;
    }
  }

  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const numeroPedido = String(pedidos.length + 1).padStart(3, '0');
  const pedido = {
    numero: numeroPedido,
    itens: carrinho,
    status: 'Pendente',
    formaPagamento: metodoPagamento,
    restauranteCnpj: restauranteCliente?.cnpj || null,
    restauranteNome: restauranteCliente?.nomeR || 'Desconhecido'
  };

  pedidos.push(pedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));

  alert(`Pagamento via ${metodoPagamento.toUpperCase()} confirmado! Pedido enviado.`);
  carrinho = [];
  atualizarCarrinho();
  mudarAba('cardapio-section');
  carregarPedidosRestaurante();
});

carregarCardapio();
atualizarCarrinho();
prepararRestaurante();

setInterval(carregarCardapio, 3000);

