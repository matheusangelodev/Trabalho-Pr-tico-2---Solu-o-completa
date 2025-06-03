const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

fetch(`http://localhost:3000/MelhoresDestinos/${id}`)
  .then(res => res.json())
  .then(dest => {
    const container = document.getElementById("detalhes");
    container.innerHTML = `
      <img src="${dest.image}" alt="${dest.name}" class="detalhe-img"/>
      <h2>${dest.name}</h2>
      <p>${dest.description}</p>
    `;
  });
