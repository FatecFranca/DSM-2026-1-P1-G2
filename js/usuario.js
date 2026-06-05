

function carregarPerfil() {
  const usuario = JSON.parse(localStorage.getItem("usuarioAtual"));
  if (!usuario) {
    window.location.href = "user-login.html";
    return;
  }
  document.getElementById("nRest").textContent = usuario.nomeR.toUpperCase() || "";

  document.getElementById("perfilNome").value = usuario.nomeR || "";
  document.getElementById("perfilEmail").value = usuario.email || "";
  document.getElementById("perfilTelefone").value = usuario.telefone || "";


  if (usuario.logo) {
    document.getElementById("previewLogo").src = usuario.logo;
    document.getElementById("previewLogo").style.display = "block";
  }

  
  toggleEdicao(false);
}

function toggleEdicao(habilitar) {
  const campos = ["perfilNome", "perfilEmail", "perfilTelefone"];
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
  carregarPerfil(); 
  toggleEdicao(false);
}

function salvarPerfil() {
  const nomeR = document.getElementById("perfilNome").value.trim();
  const email = document.getElementById("perfilEmail").value.trim();
  const telefone = document.getElementById("perfilTelefone").value;

  if (!nomeR) {
    alert("O nome não pode estar vazio!");
    return;
  }

  const usuarioAtual = JSON.parse(localStorage.getItem("usuarioAtual"));


  const fileInput = document.getElementById("inputLogo");
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      finalizarSalvamento(usuarioAtual, nomeR, email, telefone, e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    finalizarSalvamento(usuarioAtual, nomeR, email, telefone, usuarioAtual.logo || null);
  }
}

function finalizarSalvamento(usuarioAtual, nomeR, email, telefone, logo) {
  const usuarioAtualizado = {
    ...usuarioAtual,
    nomeR,
    email,
    telefone,
    logo
  };

  localStorage.setItem("usuarioAtual", JSON.stringify(usuarioAtualizado));

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const index = usuarios.findIndex(r => r.cnpj === usuarioAtual.cnpj);
  if (index !== -1) {
    usuarios[index] = usuarioAtualizado;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

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


window.addEventListener('DOMContentLoaded', () => {
    
    const hash = window.location.hash;

    if (hash) {
        
        document.querySelectorAll('.tab-section, .menu-list button, .menu-list a').forEach(elemento => {
            elemento.classList.remove('active');
        });

        
        const secaoAlvo = document.querySelector(hash);
        
        
        const idSemHash = hash.replace('#', '');
        const botaoAlvo = document.querySelector(`[data-target="${idSemHash}"]`);

       
        if (secaoAlvo && botaoAlvo) {
            secaoAlvo.classList.add('active');
            botaoAlvo.classList.add('active');
        }
    }
});