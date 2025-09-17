const apiBase = "https://lipes-cortes.vercel.app/api/servicos";

// Carrega e exibe os serviços na interface
async function carregarServicos() {
  const container = document.getElementById("services-list");
  container.innerHTML = "Carregando...";

  try {
    const res = await fetch(apiBase);
    const servicos = await res.json();

    if (!Array.isArray(servicos) || servicos.length === 0) {
      container.innerHTML = "<p>Nenhum serviço cadastrado.</p>";
      return;
    }

    container.innerHTML = "";

    servicos.forEach((servico) => {
      const card = document.createElement("div");
      card.className = "servico-card";
      card.innerHTML = `
          <input type="text" class="input-edit nome" value="${servico.nome}" />
          <input type="text" class="input-edit descricao" value="${servico.descricao}" />
          <input type="number" class="input-edit preco" value="${servico.preco}" />

          <div class="actions">
            <button onclick="atualizarServico('${servico.id}', this)">Salvar</button>
            <button onclick="excluirServico('${servico.id}')">Excluir</button>
          </div>
        `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
    container.innerHTML = "<p>Erro ao carregar serviços.</p>";
  }
}

// Adiciona novo serviço
async function adicionarServico() {
  const nome = document.getElementById("novo-servico-nome").value.trim();
  const descricao = document.getElementById("novo-servico-desc").value.trim();
  const preco = parseFloat(document.getElementById("novo-servico-preco").value);

  if (!nome || !descricao || isNaN(preco)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, descricao, preco }),
    });

    if (res.ok) {
      alert("Serviço adicionado com sucesso!");
      document.getElementById("novo-servico-nome").value = "";
      document.getElementById("novo-servico-desc").value = "";
      document.getElementById("novo-servico-preco").value = "";
      carregarServicos();
    } else {
      const data = await res.json();
      alert(data.message || "Erro ao adicionar serviço");
    }
  } catch (err) {
    console.error("Erro ao adicionar serviço:", err);
    alert("Erro ao adicionar serviço.");
  }
}

// Atualiza um serviço (PATCH)
async function atualizarServico(id, btn) {
  const card = btn.closest(".servico-card");
  const nome = card.querySelector(".nome").value.trim();
  const descricao = card.querySelector(".descricao").value.trim();
  const preco = parseFloat(card.querySelector(".preco").value);

  if (!nome || !descricao || isNaN(preco)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, descricao, preco }),
    });

    if (res.ok) {
      alert("Serviço atualizado com sucesso!");
      carregarServicos();
    } else {
      const data = await res.json();
      alert(data.message || "Erro ao atualizar serviço.");
    }
  } catch (err) {
    console.error("Erro ao atualizar serviço:", err);
  }
}

// Exclui um serviço
async function excluirServico(id) {
  if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Serviço excluído com sucesso!");
      carregarServicos();
    } else {
      const data = await res.json();
      alert(data.message || "Erro ao excluir serviço.");
    }
  } catch (err) {
    console.error("Erro ao excluir serviço:", err);
  }
}

// Adiciona evento ao botão de "Adicionar Serviço"
document
  .querySelector(".btn.orange")
  .addEventListener("click", adicionarServico);

// Carrega os serviços ao abrir a página
document.addEventListener("DOMContentLoaded", carregarServicos);
