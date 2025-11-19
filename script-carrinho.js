async function carregarCompras() {
    const tabela = document.querySelector("#purchases-table tbody");
    tabela.innerHTML = "<tr><td colspan='4'>Carregando...</td></tr>";
  
    const clienteId = getCookie("userId");
    if (!clienteId) return (window.location = "/auth.html");
  
    try {
      const res = await fetch("https://lipes-cortes.vercel.app/api/vendas", { method: "GET" });
      const vendas = await res.json();
  
      tabela.innerHTML = "";
  
      const vendasUsuario = vendas.filter((venda) => venda.clienteId === clienteId);
  
      if (vendasUsuario.length === 0) {
        tabela.innerHTML = "<tr><td colspan='4'>Nenhuma compra encontrada</td></tr>";
        return;
      }
  
      vendasUsuario.forEach((venda) => {
        const tr = document.createElement("tr");
  
        const produtos = venda.itens
          .map((i) => `${i.produto.nome} (x${i.quantidade})`)
          .join(", ");
  
        tr.innerHTML = `
          <td>${produtos}</td>
          <td>R$ ${venda.total.toFixed(2)}</td>
          <td>${new Date(venda.dataVenda).toLocaleString("pt-BR")}</td>
          <td>
            <button class="btn red" onclick="cancelarCompra(${venda.id})">Cancelar</button>
          </td>
        `;
  
        tabela.appendChild(tr);
      });
    } catch (err) {
      console.error("Erro ao carregar compras:", err);
      tabela.innerHTML = "<tr><td colspan='4'>Erro ao carregar</td></tr>";
    }
  }
  
  async function cancelarCompra(id) {
    if (!confirm("Tem certeza que deseja cancelar esta compra?")) return;
  
    try {
      const res = await fetch(`https://lipes-cortes.vercel.app/api/vendas/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
  
      if (res.ok) {
        alert("Compra cancelada com sucesso");
        carregarCompras();
      } else {
        alert(data.error || "Erro ao cancelar compra");
      }
    } catch (err) {
      console.error("Erro ao cancelar compra:", err);
      alert("Erro ao cancelar compra");
    }
  }