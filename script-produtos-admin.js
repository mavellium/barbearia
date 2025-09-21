const PRODUTOS_API = "https://lipes-cortes.vercel.app/api/produtos";

// ================== CARREGAR PRODUTOS ==================
async function carregarProdutos() {
  const tbody = document.getElementById("produtos-table-body");
  tbody.innerHTML = "<tr><td colspan='6'>Carregando...</td></tr>";

  try {
    const res = await fetch(PRODUTOS_API);
    const produtos = await res.json();

    if (!Array.isArray(produtos) || produtos.length === 0) {
      tbody.innerHTML = "<tr><td colspan='6'>Nenhum produto cadastrado.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    produtos
      .filter((p) => !p.deletado)
      .forEach((prod) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td class="nome">${prod.nome}</td>
          <td class="descricao">${prod.descricao}</td>
          <td class="preco">R$ ${prod.preco.toFixed(2)}</td>
          <td class="estoque">${prod.estoque}</td>
          <td class="imagens">
            ${
              prod.imagens && prod.imagens.length > 0
                ? prod.imagens
                    .map(
                      (img) =>
                        `<img src="${img.url}" alt="${prod.nome}" width="50" style="margin-right:5px;" />`
                    )
                    .join("")
                : "Sem imagens"
            }
          </td>
          <td class="acoes">
            <button class="btn small blue" onclick="editarProdutoInline(this, ${prod.id})">Editar</button>
            <button class="btn small red" onclick="excluirProduto(${prod.id})">Excluir</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan='6' style="color:red">Erro: ${err.message}</td></tr>`;
  }
}

// ================== EDITAR INLINE ==================
function editarProdutoInline(btn, id) {
  const tr = btn.closest("tr");

  const nome = tr.querySelector(".nome").textContent;
  const descricao = tr.querySelector(".descricao").textContent;
  const preco = tr.querySelector(".preco").textContent.replace("R$ ", "");
  const estoque = tr.querySelector(".estoque").textContent;
  const imagensTd = tr.querySelector(".imagens");
  const imagens = Array.from(imagensTd.querySelectorAll("img")).map(img => img.src);

  // Substitui células por inputs
  tr.querySelector(".nome").innerHTML = `<input type="text" value="${nome}" />`;
  tr.querySelector(".descricao").innerHTML = `<input type="text" value="${descricao}" />`;
  tr.querySelector(".preco").innerHTML = `<input type="number" step="0.01" value="${preco}" />`;
  tr.querySelector(".estoque").innerHTML = `<input type="number" value="${estoque}" />`;
  tr.querySelector(".imagens").innerHTML = `<input type="text" value="${imagens.join(", ")}" placeholder="URLs separadas por vírgula" />`;

  // Substitui botões
  tr.querySelector(".acoes").innerHTML = `
    <button class="btn small green" onclick="salvarProdutoInline(this, ${id})">Salvar</button>
    <button class="btn small gray" onclick="cancelarEdicaoInline(${id})">Cancelar</button>
  `;
}

// ================== SALVAR EDIÇÃO INLINE ==================
async function salvarProdutoInline(btn, id) {
  const tr = btn.closest("tr");

  const nome = tr.querySelector("td:nth-child(1) input").value.trim();
  const descricao = tr.querySelector("td:nth-child(2) input").value.trim();
  const preco = parseFloat(tr.querySelector("td:nth-child(3) input").value);
  const estoque = parseInt(tr.querySelector("td:nth-child(4) input").value);
  const imagensInput = tr.querySelector("td:nth-child(5) input").value.trim();

  if (!nome || !descricao || isNaN(preco) || isNaN(estoque)) {
    return alert("Preencha todos os campos corretamente.");
  }

  const imagens = imagensInput ? imagensInput.split(",").map(url => url.trim()) : [];

  try {
    const res = await fetch(`${PRODUTOS_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, descricao, preco, estoque, imagens }),
    });

    if (!res.ok) {
      const erro = await res.json();
      return alert("Erro: " + (erro.error || "Não foi possível atualizar o produto."));
    }

    carregarProdutos();
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    alert("Erro ao atualizar produto.");
  }
}

// ================== CANCELAR EDIÇÃO INLINE ==================
function cancelarEdicaoInline(id) {
  carregarProdutos(); // recarrega tabela e desfaz edição
}

// ================== EXCLUIR PRODUTO ==================
async function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  try {
    const res = await fetch(`${PRODUTOS_API}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const erro = await res.json();
      return alert("Erro: " + (erro.error || "Não foi possível excluir o produto."));
    }

    carregarProdutos();
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    alert("Erro ao excluir produto.");
  }
}

// ================== EVENTOS ==================
// Inicializa tabela
document.addEventListener("DOMContentLoaded", carregarProdutos);
