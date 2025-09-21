  // ================== Funções auxiliares para datas ==================
  function normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function startOfWeek(date) {
    const d = normalizeDate(date);
    const day = d.getDay(); // domingo = 0
    d.setDate(d.getDate() - day);
    return d;
  }

  function endOfWeek(date) {
    const s = startOfWeek(date);
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    e.setHours(23, 59, 59, 999);
    return e;
  }

  function formatDate(d) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // ================== Estado local ==================
  let currentWeek = new Date();
  let chartAgendamentos = null;
  let chartFaturamento = null;
  let chartVendas = null;
  let chartFaturamentoVendas = null;

  // ================== Fetch Agendamentos ==================
  async function fetchAgendamentos() {
    try {
      const res = await fetch("https://lipes-cortes.vercel.app/api/agendamentos");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro carregando agendamentos:", error);
      return [];
    }
  }

  // ================== Fetch Vendas ==================
  async function fetchVendas() {
    try {
      const res = await fetch("https://lipes-cortes.vercel.app/api/vendas");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro carregando vendas:", error);
      return [];
    }
  }

  // ================== Atualiza todos os gráficos ==================
  async function updateCharts() {
    const agendamentos = await fetchAgendamentos();
    const vendas = await fetchVendas();

    const start = startOfWeek(currentWeek);
    const end = endOfWeek(currentWeek);
    document.getElementById("week-range").textContent =
      `${formatDate(start)} - ${formatDate(end)}`;

    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    // ========== Dados de agendamentos ==========
    const dataAgendamentos = daysOfWeek.map((day) => ({
      day,
      agendamentos: 0,
      faturamento: 0,
    }));

    agendamentos.forEach((ag) => {
      const d = normalizeDate(ag.dataAgendamento);
      if (d >= start && d <= end) {
        const idx = d.getDay();
        const fatur = (ag.servicos || []).reduce(
          (sum, s) => sum + (s.servico?.preco || 0),
          0
        );
        dataAgendamentos[idx].agendamentos += 1;
        dataAgendamentos[idx].faturamento += fatur;
      }
    });

    const labels = dataAgendamentos.map((o) => o.day);
    const agData = dataAgendamentos.map((o) => o.agendamentos);
    const fatData = dataAgendamentos.map((o) => o.faturamento);

    if (chartAgendamentos) chartAgendamentos.destroy();
    if (chartFaturamento) chartFaturamento.destroy();

    const ctx1 = document.getElementById("chart-agendamentos").getContext("2d");
    chartAgendamentos = new Chart(ctx1, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Agendamentos",
            data: agData,
            backgroundColor: "#3182CE",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    });

    const ctx2 = document.getElementById("chart-faturamento").getContext("2d");
    chartFaturamento = new Chart(ctx2, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Faturamento (R$)",
            data: fatData,
            borderColor: "#48BB78",
            backgroundColor: "rgba(72, 187, 120, 0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `R$ ${ctx.parsed.y.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`,
            },
          },
        },
      },
    });

    // ========== Dados de vendas ==========
    const dataVendas = daysOfWeek.map((day) => ({
      day,
      vendas: 0,
      faturamento: 0,
    }));

    vendas.forEach((v) => {
      const d = normalizeDate(v.dataVenda);
      if (d >= start && d <= end) {
        const idx = d.getDay();
        dataVendas[idx].vendas += 1;
        dataVendas[idx].faturamento += v.total || 0;
      }
    });

    const vendasData = dataVendas.map((o) => o.vendas);
    const faturamentoVendasData = dataVendas.map((o) => o.faturamento);

    if (chartVendas) chartVendas.destroy();
    if (chartFaturamentoVendas) chartFaturamentoVendas.destroy();

    const ctx3 = document.getElementById("chart-vendas").getContext("2d");
    chartVendas = new Chart(ctx3, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Vendas",
            data: vendasData,
            backgroundColor: "#F6AD55",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    });

    const ctx4 = document
      .getElementById("chart-faturamento-vendas")
      .getContext("2d");
    chartFaturamentoVendas = new Chart(ctx4, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Faturamento Vendas (R$)",
            data: faturamentoVendasData,
            borderColor: "#D53F8C",
            backgroundColor: "rgba(213, 63, 140, 0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `R$ ${ctx.parsed.y.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`,
            },
          },
        },
      },
    });
  }

  // ================== Eventos semana ==================
  document.getElementById("prev-week").addEventListener("click", () => {
    currentWeek.setDate(currentWeek.getDate() - 7);
    updateCharts();
  });
  document.getElementById("next-week").addEventListener("click", () => {
    currentWeek.setDate(currentWeek.getDate() + 7);
    updateCharts();
  });

  // ================== Inicialização ==================
  document.addEventListener("DOMContentLoaded", () => {
    updateCharts();
  });