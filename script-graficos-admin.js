// Funções auxiliares para manipular datas
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // domingo como início (day=0)
  return new Date(d.setDate(diff));
}
function endOfWeek(date) {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(s.getDate() + 6); // sábado
  return e;
}
function formatDate(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Estado “local”
let currentWeek = new Date();

// Referências dos gráficos
let chartAgendamentos = null;
let chartFaturamento = null;

// Função para buscar agendamentos da API
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

// Função que processa os dados para o gráfico da semana
async function updateCharts() {
  const agendamentos = await fetchAgendamentos();

  const start = startOfWeek(currentWeek);
  const end = endOfWeek(currentWeek);

  const weekRange = `${formatDate(start)} - ${formatDate(end)}`;
  document.getElementById("week-range").textContent = weekRange;

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const dataObj = daysOfWeek.map((day) => ({
    day,
    agendamentos: 0,
    faturamento: 0,
  }));

  agendamentos.forEach((ag) => {
    const d = new Date(ag.dataAgendamento);
    if (d >= start && d <= end) {
      const idx = d.getDay();
      // soma faturamento
      const fatur = (ag.servicos || []).reduce(
        (sum, s) => sum + (s.servico.preco || 0),
        0
      );
      dataObj[idx].agendamentos += 1;
      dataObj[idx].faturamento += fatur;
    }
  });

  const labels = dataObj.map((o) => o.day);
  const agData = dataObj.map((o) => o.agendamentos);
  const fatData = dataObj.map((o) => o.faturamento);

  // Se já existir os charts destruí-los para recriar
  if (chartAgendamentos) chartAgendamentos.destroy();
  if (chartFaturamento) chartFaturamento.destroy();

  const ctx1 = document.getElementById("chart-agendamentos").getContext("2d");
  chartAgendamentos = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: labels,
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
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Agendamentos: ${context.parsed.y}`;
            },
          },
        },
      },
    },
  });

  const ctx2 = document.getElementById("chart-faturamento").getContext("2d");
  chartFaturamento = new Chart(ctx2, {
    type: "line",
    data: {
      labels: labels,
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
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const v = context.parsed.y;
              return `R$ ${v.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`;
            },
          },
        },
      },
    },
  });
}

// Eventos dos botões anterior / próxima semana
document.getElementById("prev-week").addEventListener("click", () => {
  currentWeek.setDate(currentWeek.getDate() - 7);
  updateCharts();
});
document.getElementById("next-week").addEventListener("click", () => {
  currentWeek.setDate(currentWeek.getDate() + 7);
  updateCharts();
});

// Carrega ao iniciar
document.addEventListener("DOMContentLoaded", () => {
  updateCharts();
});
