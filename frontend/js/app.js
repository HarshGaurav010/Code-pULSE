// ================================
// 🔗 BACKEND BASE URL (CHANGE ONLY THIS)
// ================================
const API_BASE = "https://code-pulse-2.onrender.com";

// ================================
// GLOBAL STATE
// ================================
let currentRole = "";
let resources = [];

// ================================
// LOGIN / LOGOUT
// ================================
function login() {
  currentRole = document.getElementById("role").value;

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("appSection").classList.remove("hidden");

  showPage("dashboard");

  if (currentRole === "admin") {
    document.getElementById("adminPanel").classList.remove("hidden");
  }
  if (currentRole === "faculty") {
    document.getElementById("facultyPanel").classList.remove("hidden");
  }
  if (currentRole === "student") {
    document.getElementById("studentPanel").classList.remove("hidden");
  }

  loadResources();
}

function logout() {
  location.reload();
}

// ================================
// PAGE NAVIGATION
// ================================
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.add("hidden");
  });

  document.getElementById(pageId).classList.remove("hidden");
}

// ================================
// LOAD RESOURCES (DASHBOARD + BOOKING)
// ================================
function loadResources() {
  fetch(`${API_BASE}/resources`)
    .then(res => res.json())
    .then(data => {
      resources = data;
      renderResources();
      populateResourceSelect();
    })
    .catch(err => console.error("Error loading resources:", err));
}

function renderResources() {
  const list = document.getElementById("resourceList");
  list.innerHTML = "";

  resources.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.name} (${r.type})`;
    list.appendChild(li);
  });
}

function populateResourceSelect() {
  const select = document.getElementById("resourceSelect");
  select.innerHTML = "";

  resources.forEach(r => {
    const option = document.createElement("option");
    option.value = r.id;
    option.textContent = r.name;
    select.appendChild(option);
  });
}

// ================================
// BOOK RESOURCE
// ================================
function bookResource() {
  const resourceId = document.getElementById("resourceSelect").value;
  const date = document.getElementById("date").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      resourceId,
      date,
      startTime,
      endTime,
      role: currentRole
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("bookingMessage").textContent =
        "✅ Resource booked successfully!";
    })
    .catch(err => {
      document.getElementById("bookingMessage").textContent =
        "❌ Booking failed";
      console.error(err);
    });
}

// ================================
// SEARCH RESOURCE
// ================================
function searchResource() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const resultList = document.getElementById("searchResult");
  resultList.innerHTML = "";

  const filtered = resources.filter(r =>
    r.name.toLowerCase().includes(query)
  );

  filtered.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.name} (${r.type})`;
    resultList.appendChild(li);
  });
}

// ================================
// ADMIN: ADD RESOURCE
// ================================
function adminAddResource() {
  const name = document.getElementById("newResourceName").value;
  const type = document.getElementById("newResourceType").value;

  fetch(`${API_BASE}/resources`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, type })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("newResourceName").value = "";
      loadResources();
    })
    .catch(err => console.error("Error adding resource:", err));
}
