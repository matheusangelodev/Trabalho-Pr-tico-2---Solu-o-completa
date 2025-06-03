const form = document.getElementById("formCadastro");
const nameInput = document.getElementById("name");
const imageInput = document.getElementById("image");
const descriptionInput = document.getElementById("description");
const tableBody = document.getElementById("usuariosTableBody");
const apiUrl = "http://localhost:3000/usuarios";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newUser = {
    name: nameInput.value,
    image: imageInput.value,
    description: descriptionInput.value
  };

  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  });

  form.reset();
  loadUsers();
});

async function loadUsers() {
  const res = await fetch(apiUrl);
  const data = await res.json();

  tableBody.innerHTML = "";

  data.forEach((user) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><img src="${user.image}" alt="${user.name}" width="50" height="50" style="border-radius: 50%"/></td>
      <td contenteditable="true" data-field="name">${user.name}</td>
      <td contenteditable="true" data-field="description">${user.description || ""}</td>
      <td>
        <button onclick="updateUser('${user.id}', this)">Salvar</button>
        <button onclick="deleteUser('${user.id}')">Excluir</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

window.updateUser = async function (id, btn) {
  const row = btn.closest("tr");

  const updatedUser = {
    name: row.querySelector('[data-field="name"]').textContent.trim(),
    image: row.querySelector("img").src,
    description: row.querySelector('[data-field="description"]').textContent.trim()
  };

  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser)
  });

  loadUsers();
};

window.deleteUser = async function (id) {
  if (confirm("Deseja realmente excluir este usuário?")) {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    loadUsers();
  }
};

loadUsers();
