export const mostrarCarregando = (loadingElement, mostrar) => {
  loadingElement.style.display = mostrar ? "block" : "none";
};

export const mostrarMensagem = (mensagemElement, texto, tipo = "sucesso") => {
  mensagemElement.textContent = texto;
  mensagemElement.className = `mensagem ${tipo}`;
  mensagemElement.style.display = "block";

  setTimeout(() => {
    mensagemElement.style.display = "none";
  }, 3000);
};

export const criarElementoCliente = (cliente, excluirCallback) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${cliente.nome}</strong> - ${cliente.email}
    <button>Excluir</button>
  `;

  li.querySelector("button").addEventListener("click", () => excluirCallback(cliente._id));
  return li;
};
