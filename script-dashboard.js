  const API_URL = "https://lipes-cortes.vercel.app/api/agendamentos";

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  function logout() {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert("Você saiu da sua conta.");
    window.location.href = "auth.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const userId = getCookie("userId");
    if (!userId) {
      alert("Usuário não autenticado. Faça login novamente.");
      window.location.href = "auth.html";
      return;
    }

    carregarAgendamentos(userId);
    carregarServicos();

    const form = document.getElementById("schedule-form");
    form.addEventListener("submit", (e) => criarAgendamento(e, userId));
  });

  async function carregarAgendamentos(userId) {
    try {
      const res = await fetch(API_URL);
      let agendamentos = await res.json();
      agendamentos = agendamentos.filter(ag => ag.userId === userId);

      const tbody = document.querySelector("#appointments-table tbody");
      tbody.innerHTML = "";

      agendamentos.forEach(ag => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${ag.servicos.map(s => s.servico.nome).join(", ")}</td>
          <td>${new Date(ag.dataAgendamento).toLocaleString("pt-BR")}</td>
          <td>${ag.status}</td>
          <td>
            <button class="action-btn edit-btn" onclick="remarcarAgendamento('${ag.id}')">Editar</button>
            <button class="action-btn delete-btn" onclick="deletarAgendamento('${ag.id}')">Excluir</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err);
    }
  }

  async function carregarServicos() {
    try {
      const res = await fetch("https://lipes-cortes.vercel.app/api/servicos");
      const servicos = await res.json();
      const container = document.getElementById("service-checkboxes");
      container.innerHTML = "";

      servicos.forEach(s => {
        const label = document.createElement("label");
        label.className = "checkbox-container";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "service-checkbox";
        input.value = s.id;

        const custom = document.createElement("span");
        custom.className = "custom-checkbox";

        label.appendChild(input);
        label.appendChild(custom);
        label.append(` ${s.nome} - R$${s.preco.toFixed(2)}`);

        container.appendChild(label);
      });
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
    }
  }

  async function criarAgendamento(e, userId) {
    e.preventDefault();
    const checkboxes = document.querySelectorAll('input[name="service-checkbox"]:checked');
    const servicoIds = Array.from(checkboxes).map(cb => cb.value);
    const data = document.getElementById("appointment-date").value;

    if (!servicoIds.length) {
      alert("Selecione pelo menos um serviço.");
      return;
    }

    const novoAgendamento = { userId, dataAgendamento: data, servicoIds };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoAgendamento),
      });

      if (!res.ok) {
        const erro = await res.json();
        alert("Erro: " + erro.error);
        return;
      }

      alert("Agendamento criado com sucesso!");
      document.getElementById("schedule-form").reset();
      carregarAgendamentos(userId);
    } catch (err) {
      console.error("Erro ao criar agendamento:", err);
    }
  }

  async function remarcarAgendamento(id) {
    const novaData = prompt("Informe a nova data (AAAA-MM-DD HH:mm):");
    if (!novaData) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novaData }),
      });

      if (!res.ok) {
        const erro = await res.json();
        alert("Erro: " + erro.error);
        return;
      }

      alert("Agendamento remarcado!");
      carregarAgendamentos(getCookie("userId"));
    } catch (err) {
      console.error("Erro ao remarcar:", err);
    }
  }

  async function deletarAgendamento(id) {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const erro = await res.json();
        alert("Erro: " + erro.error);
        return;
      }

      alert("Agendamento excluído!");
      carregarAgendamentos(getCookie("userId"));
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  }