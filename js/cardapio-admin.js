const botao = document.getElementById("adicionar");
const fileInput = document.getElementById("imagemProduto");
const previewProduto = document.getElementById("previewProduto");


function comprimirImagem(file, callback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 400;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
      callback(dataUrl);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

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
  const descricao = document.getElementById("descricao").value.trim();
  const restauranteAtual = JSON.parse(localStorage.getItem("restauranteAtual")) || {};

  if (!nome || !preco || !descricao) {
    alert("Preencha o nome, preço, e a descrição do produto.");
    return;
  }

  const novoProduto = {
    id: Date.now(),
    nome,
    preco,
    descricao,
    imagem: null,
    restauranteCnpj: restauranteAtual.cnpj || null,
    restauranteNome: restauranteAtual.nomeR || 'Desconhecido'
  };

  if (fileInput.files && fileInput.files[0]) {
    
    comprimirImagem(fileInput.files[0], (imagemComprimida) => {
      novoProduto.imagem = imagemComprimida;
      salvarProduto(novoProduto);
    });
  } else {
    salvarProduto(novoProduto);
  }
});

function salvarProduto(produto) {
  try {
    const cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];
    cardapio.push(produto);
    localStorage.setItem("cardapio", JSON.stringify(cardapio));
    carregarProdutos();
    limparFormulario();
    alert("Produto adicionado!");
  } catch (error) {
    
    console.error(error);
    alert("Erro ao salvar: O armazenamento está cheio! Tente usar uma imagem menor ou limpe o cardápio.");
  }
}

function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("descricao").value = "";
  fileInput.value = "";
  previewProduto.src = "";
  previewProduto.style.display = "none";
}

function carregarProdutos() {
  const restauranteAtual = JSON.parse(localStorage.getItem("restauranteAtual"));
  const cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];
  const produtosDoRestaurante = restauranteAtual
    ? cardapio.filter(produto => produto.restauranteCnpj === restauranteAtual.cnpj)
    : [];

  const lista = document.getElementById("lista-produtos");
  if (!lista) return; 
  lista.innerHTML = "";

  if (produtosDoRestaurante.length === 0) {
    lista.innerHTML = '<p>Nenhum produto cadastrado ainda.</p>';
    return;
  }

  produtosDoRestaurante.forEach(produto => {
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
  const restauranteAtual = JSON.parse(localStorage.getItem("restauranteAtual"));
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  const pedidosDoRestaurante = restauranteAtual
    ? pedidos.filter(pedido => pedido.restauranteCnpj === restauranteAtual.cnpj)
    : [];

  const div = document.getElementById("pedidos");
  if (!div) return; 
  div.innerHTML = "";

  if (pedidosDoRestaurante.length === 0) {
    div.innerHTML = '<p>Nenhum pedido recebido ainda.</p>';
    return;
  }

  pedidosDoRestaurante.forEach(pedido => {
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