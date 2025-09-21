const PRODUTOS_API = "https://lipes-cortes.vercel.app/api/produtos";

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();

  document
    .getElementById("btn-adicionar-produto")
    .addEventListener("click", criarProduto);
});

// ================== LISTAR ==================
async function carregarProdutos() {
  try {
    const res = await fetch(PRODUTOS_API);
    const produtos = await res.json();

    const tbody = document.getElementById("produtos-table-body");
    tbody.innerHTML = "";

    produtos
      .filter((p) => !p.deletado)
      .forEach((prod) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${prod.nome}</td>
          <td>${prod.descricao}</td>
          <td>R$ ${prod.preco.toFixed(2)}</td>
          <td>${prod.estoque}</td>
          <td>
            <button class="btn small blue" onclick="editarProduto(${
              prod.id
            })">Editar</button>
            <button class="btn small red" onclick="excluirProduto(${
              prod.id
            })">Excluir</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

// ================== CRIAR ==================
async function criarProduto() {
  const nome = document.getElementById("novo-produto-nome").value.trim();
  const descricao = document.getElementById("novo-produto-desc").value.trim();
  const preco = parseFloat(document.getElementById("novo-produto-preco").value);
  const estoque = parseInt(
    document.getElementById("novo-produto-estoque").value
  );

  if (!nome || !descricao || isNaN(preco) || isNaN(estoque)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    const res = await fetch(PRODUTOS_API, {
      method: "POST",
      body: JSON.stringify({ nome, descricao, preco, estoque }),
    });

    if (!res.ok) {
      const erro = await res.json();
      alert("Erro: " + erro.error);
      return;
    }

    alert("Produto criado com sucesso!");
    document.getElementById("novo-produto-nome").value = "";
    document.getElementById("novo-produto-desc").value = "";
    document.getElementById("novo-produto-preco").value = "";
    document.getElementById("novo-produto-estoque").value = "";
    carregarProdutos();
  } catch (err) {
    console.error("Erro ao criar produto:", err);
  }
}

// ================== EDITAR ==================
function editarProduto(id) {
  const tbody = document.getElementById("produtos-table-body");
  const tr = Array.from(tbody.children).find((r) =>
    r.querySelector(`button[onclick="editarProduto(${id})"]`)
  );

  if (!tr) return;

  // pega os valores atuais
  const nome = tr.children[0].textContent;
  const descricao = tr.children[1].textContent;
  const preco = tr.children[2].textContent.replace("R$ ", "");
  const estoque = tr.children[3].textContent;

  // substitui células por inputs
  tr.children[0].innerHTML = `<input type="text" value="${nome}" />`;
  tr.children[1].innerHTML = `<input type="text" value="${descricao}" />`;
  tr.children[2].innerHTML = `<input type="number" step="0.01" value="${preco}" />`;
  tr.children[3].innerHTML = `<input type="number" value="${estoque}" />`;

  // altera botões
  tr.children[4].innerHTML = `
    <button class="btn small green" onclick="salvarProduto(${id}, this)">Salvar</button>
    <button class="btn small gray" onclick="cancelarEdicao(${id})">Cancelar</button>
  `;
}

// ================== SALVAR E CANCELAR ==================
async function salvarProduto(id, btn) {
  const tr = btn.closest("tr");
  const [nome, descricao, preco, estoque] = Array.from(
    tr.querySelectorAll("input")
  ).map((i) => i.value.trim());

  if (!nome || !descricao || isNaN(preco) || isNaN(estoque)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    const res = await fetch(`${PRODUTOS_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        descricao,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
      }),
    });

    if (!res.ok) {
      const erro = await res.json();
      alert("Erro: " + erro.error);
      return;
    }

    alert("Produto atualizado!");
    carregarProdutos();
  } catch (err) {
    console.error("Erro ao salvar produto:", err);
  }
}

function cancelarEdicao(id) {
  carregarProdutos(); // apenas recarrega a tabela
}

// ================== EXCLUIR ==================
async function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  try {
    const res = await fetch(`${PRODUTOS_API}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const erro = await res.json();
      alert("Erro: " + erro.error);
      return;
    }

    alert("Produto excluído com sucesso!");
    carregarProdutos();
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
  }
}
