const form = document.getElementById("formCadastro");
const loginInput = document.getElementById("login");
const senhaInput = document.getElementById("senha");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const tableBody = document.getElementById("usuariosTableBody");
const apiUrl = "http://localhost:3000/usuarios";

// CADASTRO
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoUsuario = {
    login: loginInput.value,
    senha: senhaInput.value,
    nome: nomeInput.value,
    email: emailInput.value
  };

  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoUsuario)
  });

  form.reset();
  loadUsers();
});

// CARREGAR USUÁRIOS
async function loadUsers() {
  const res = await fetch(apiUrl);
  const data = await res.json();

  tableBody.innerHTML = "";

  data.forEach((user) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td contenteditable="true" data-field="login">${user.login}</td>
      <td contenteditable="true" data-field="senha">${user.senha}</td>
      <td contenteditable="true" data-field="nome">${user.nome}</td>
      <td contenteditable="true" data-field="email">${user.email}</td>
      <td>
        <button onclick="updateUser('${user.id}', this)">Salvar</button>
        <button onclick="deleteUser('${user.id}')">Excluir</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

// ATUALIZAR USUÁRIO
window.updateUser = async function (id, btn) {
  const row = btn.closest("tr");

  const updatedUser = {
    login: row.querySelector('[data-field="login"]').textContent.trim(),
    senha: row.querySelector('[data-field="senha"]').textContent.trim(),
    nome: row.querySelector('[data-field="nome"]').textContent.trim(),
    email: row.querySelector('[data-field="email"]').textContent.trim()
  };

  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser)
  });

  loadUsers();
};

// EXCLUIR USUÁRIO
window.deleteUser = async function (id) {
  if (confirm("Deseja realmente excluir este usuário?")) {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    loadUsers();
  }
};

loadUsers();
