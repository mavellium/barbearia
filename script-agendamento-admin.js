// Função para alterar status via PATCH
async function alterarStatusAgendamento(id, novoStatus) {
  try {
    const res = await fetch(
      `https://lipes-cortes.vercel.app/api/agendamentos/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      }
    );
    if (res.ok) {
      alert(`Agendamento marcado como ${novoStatus}!`);
      carregarAgendamentos();
    } else {
      const data = await res.json();
      alert(data.error || `Erro ao alterar status para ${novoStatus}`);
    }
  } catch (err) {
    console.error(`Erro ao alterar status para ${novoStatus}:`, err);
  }
}

// Função para carregar agendamentos e montar a tabela
async function carregarAgendamentos() {
  const tbody = document.getElementById("agendamentos-table-body");
  tbody.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";

  try {
    const res = await fetch("https://lipes-cortes.vercel.app/api/agendamentos");

    if (!res.ok) {
      const errorData = await res.json();
      tbody.innerHTML = `<tr><td colspan="5">${
        errorData.error || "Erro ao carregar"
      }</td></tr>`;
      return;
    }

    const agendamentos = await res.json();

    if (agendamentos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">Nenhum agendamento encontrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";

    agendamentos.forEach((ag) => {
      const tr = document.createElement("tr");

      const cliente = ag.user?.nome || "N/A";
      const servicos = ag.servicos.map((s) => s.servico.nome).join(", ");
      const status = ag.status;
      const data = new Date(ag.dataAgendamento).toLocaleString("pt-BR");

      // Criar dropdown HTML para ações
      const acoesDropdown = `
          <div class="dropdown">
            <button class="dropbtn">Ações ▼</button>
            <div class="dropdown-content">
              <button class="btn-confirmar" onclick="alterarStatusAgendamento('${ag.id}', 'CONFIRMADO')">Confirmar</button>
              <button class="btn-cancelar" onclick="alterarStatusAgendamento('${ag.id}', 'CANCELADO')">Cancelar</button>
              <button class="btn-pendente" onclick="alterarStatusAgendamento('${ag.id}', 'PENDENTE')">Pendente</button>
              <button class="btn-alterar" onclick="alterarDataAgendamento('${ag.id}')">Alterar Data</button>
            </div>
          </div>
        `;

      tr.innerHTML = `
          <td>${cliente}</td>
          <td>${servicos}</td>
          <td><span class="badge ${
            status === "CONFIRMADO"
              ? "badge-confirmado"
              : status === "CANCELADO"
              ? "badge-cancelado"
              : "badge-pendente"
          }">${status}</span></td>
          <td>${acoesDropdown}</td>
          <td>${data}</td>
        `;

      tbody.appendChild(tr);
    });

    // Adicionar eventos para dropdowns (para abrir/fechar ao clicar)
    adicionarEventosDropdowns();
  } catch (err) {
    console.error("Erro ao carregar agendamentos:", err);
    tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar dados</td></tr>`;
  }
}

// Função placeholder para alterar data
function alterarDataAgendamento(id) {
  alert("Função alterarDataAgendamento ainda não implementada");
}

// Função para adicionar eventos de abrir/fechar dropdowns
function adicionarEventosDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector(".dropbtn");
    const content = dropdown.querySelector(".dropdown-content");

    btn.onclick = (e) => {
      e.stopPropagation();

      // Fecha todos os dropdowns abertos menos este
      document.querySelectorAll(".dropdown-content").forEach((el) => {
        if (el !== content) el.style.display = "none";
      });

      // Toggle visibilidade do conteúdo
      content.style.display =
        content.style.display === "block" ? "none" : "block";
    };
  });
}

// Fecha dropdown se clicar fora
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown-content").forEach((el) => {
    el.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  carregarAgendamentos();
});

async function alterarDataAgendamento(id) {
  const novaData = prompt("Digite a nova data e hora (ex: 2025-09-20 14:00)");
  if (!novaData) return;

  try {
    const res = await fetch(
      `https://lipes-cortes.vercel.app/api/agendamentos/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novaData }),
      }
    );
    if (res.ok) {
      alert("Data alterada!");
      carregarAgendamentos();
    } else {
      const data = await res.json();
      alert(data.error || "Erro ao alterar data");
    }
  } catch (err) {
    console.error("Erro ao alterar data:", err);
  }
}
