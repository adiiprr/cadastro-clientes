import { Cliente } from './classes.js';
import { mostrarCarregando, mostrarMensagem, criarElementoCliente } from './utils.js';

const API_URL = "https://crudcrud.com/api/dec5652395b04275bbdd1f136439bb4a/clientes";

const form = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");
const mensagem = document.getElementById("mensagem");
const loading = document.getElementById("loading");

const buscarClientes = async () => {
  mostrarCarregando(loading, true);

  try {
    const resposta = await fetch(API_URL);
    const clientes = await resposta.json();
    return clientes;
  } catch (erro) {
    console.error("Erro ao buscar clientes:", erro);
    mostrarMensagem(mensagem, "Erro ao carregar clientes!", "erro");
    return [];
  } finally {
    mostrarCarregando(loading, false);
  }
};

const renderizarClientes = (clientes) => {
  lista.innerHTML = "";

  if (!clientes.length) {
    lista.innerHTML = "<li>Nenhum cliente cadastrado.</li>";
    return;
  }

  clientes
    .map(cliente => criarElementoCliente(cliente, excluirCliente))
    .forEach(li => lista.appendChild(li));
};

const listarClientes = async () => {
  const clientes = await buscarClientes();
  renderizarClientes(clientes);
};

const cadastrarCliente = async (cliente) => {
  mostrarCarregando(loading, true);

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    });
    mostrarMensagem(mensagem, "Cliente cadastrado com sucesso!");
  } catch (erro) {
    console.error("Erro ao cadastrar:", erro);
    mostrarMensagem(mensagem, "Erro ao cadastrar cliente!", "erro");
  } finally {
    mostrarCarregando(loading, false);
    listarClientes();
  }
};

const excluirCliente = async (id) => {
  if (!confirm("Deseja realmente excluir este cliente?")) return;

  mostrarCarregando(loading, true);

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    mostrarMensagem(mensagem, "Cliente excluído com sucesso!");
  } catch (erro) {
    console.error("Erro ao excluir:", erro);
    mostrarMensagem(mensagem, "Erro ao excluir cliente!", "erro");
  } finally {
    mostrarCarregando(loading, false);
    listarClientes();
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nome || !email) {
    mostrarMensagem(mensagem, "Preencha todos os campos!", "erro");
    return;
  }

  const novoCliente = new Cliente(nome, email);
  form.reset();
  cadastrarCliente(novoCliente);
});

listarClientes();
