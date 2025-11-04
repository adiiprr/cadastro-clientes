const API_URL = "https://crudcrud.com/api/dec5652395b04275bbdd1f136439bb4a/clientes";

const form = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");
const mensagem = document.getElementById("mensagem");
const loading = document.getElementById("loading");

function mostrarCarregando(mostrar) {
  loading.style.display = mostrar ? "block" : "none";
}

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.style.display = "block";

  setTimeout(() => {
    mensagem.style.display = "none";
  }, 3000);
}

async function listarClientes() {
  lista.innerHTML = "";
  mostrarCarregando(true);

  try {
    const resposta = await fetch(API_URL);
    const clientes = await resposta.json();

    lista.innerHTML = "";
    if (clientes.length === 0) {
      lista.innerHTML = "<li>Nenhum cliente cadastrado.</li>";
    } else {
      clientes.forEach(cliente => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${cliente.nome}</strong> - ${cliente.email}
          <button onclick="excluirCliente('${cliente._id}')">Excluir</button>
        `;
        lista.appendChild(li);
      });
    }
  } catch (erro) {
    console.error(erro);
    lista.innerHTML = "<li>Erro ao carregar clientes.</li>";
    mostrarMensagem("Erro ao carregar clientes!", "erro");
  } finally {
    mostrarCarregando(false);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nome || !email) {
    mostrarMensagem("Preencha todos os campos!", "erro");
    return;
  }

  const novoCliente = { nome, email };

  try {
    mostrarCarregando(true);

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoCliente)
    });

    form.reset();
    listarClientes();
    mostrarMensagem("Cliente cadastrado com sucesso!");
  } catch (erro) {
    console.error("Erro ao cadastrar:", erro);
    mostrarMensagem("Erro ao cadastrar cliente!", "erro");
  } finally {
    mostrarCarregando(false);
  }
});

async function excluirCliente(id) {
  if (!confirm("Deseja realmente excluir este cliente?")) return;

  try {
    mostrarCarregando(true);
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    listarClientes();
    mostrarMensagem("Cliente excluído com sucesso!");
  } catch (erro) {
    console.error("Erro ao excluir:", erro);
    mostrarMensagem("Erro ao excluir cliente!", "erro");
  } finally {
    mostrarCarregando(false);
  }
}

listarClientes();
