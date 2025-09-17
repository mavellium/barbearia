document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    const res = await fetch("https://lipes-cortes.vercel.app/api/logout", {
      method: "POST",
    });
    const data = await res.json();
    alert(data.message || "Logout realizado");
    window.location.href = "auth.html"; // volta para login
  } catch (err) {
    console.error("Erro no logout", err);
  }
});
