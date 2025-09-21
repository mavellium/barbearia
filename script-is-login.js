function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function checkLoginRedirect() {
  const token = getCookie("token");
  const role = getCookie("role");

  if (!token || !role) {
    return;
  }

  if (role === "ADMIN") {
    window.location.href = "admin-dashboard.html";
  } else {
    window.location.href = "dashboard.html";
  }
}

document.addEventListener("DOMContentLoaded", checkLoginRedirect);