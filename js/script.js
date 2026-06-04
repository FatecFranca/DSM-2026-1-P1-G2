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
}

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