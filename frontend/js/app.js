const API_URL = "http://localhost:3000";
let currentRole = "";
let resources = [];
let bookings = [];

/* LOGIN */
function login() {
    currentRole = document.getElementById("role").value;
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("appSection").classList.remove("hidden");
    loadDashboard();
    loadRolePanels();
}

/* DASHBOARD */
async function loadDashboard() {
    const res = await fetch(`${API_URL}/api/resources`);
    resources = await res.json();

    let list = document.getElementById("resourceList");
    list.innerHTML = "";

    resources.forEach(r => {
        list.innerHTML += `<li>${r.name} (${r.type})</li>`;
    });

    // Populate booking dropdown
    let select = document.getElementById("resourceSelect");
    select.innerHTML = "";
    resources.forEach(r => {
        select.innerHTML += `<option value="${r.id}">${r.name}</option>`;
    });
}

/* BOOK RESOURCE */
async function bookResource() {
    const resourceId = document.getElementById("resourceSelect").value;
    const date = document.getElementById("date").value;
    const start = document.getElementById("startTime").value;
    const end = document.getElementById("endTime").value;

    const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: Number(resourceId), date, start, end, role: currentRole })
    });

    const data = await response.json();
    document.getElementById("bookingMessage").innerText =
        response.ok ? "✅ Booking Successful!" : "❌ " + data.message;

    loadRolePanels();
}

/* ROLE PANELS */
async function loadRolePanels() {
    hideAllRolePanels();

    const res = await fetch(`${API_URL}/api/bookings`);
    bookings = await res.json();

    if (currentRole === "admin") {
        document.getElementById("adminPanel").classList.remove("hidden");
        loadAllBookings();
    }
    if (currentRole === "faculty") {
        document.getElementById("facultyPanel").classList.remove("hidden");
        loadFacultyBookings();
    }
    if (currentRole === "student") {
        document.getElementById("studentPanel").classList.remove("hidden");
        loadStudentBookings();
    }
}

function hideAllRolePanels() {
    document.querySelectorAll("#adminPanel, #facultyPanel, #studentPanel")
        .forEach(p => p.classList.add("hidden"));
}

/* ADMIN VIEW */
function loadAllBookings() {
    const list = document.getElementById("allBookings");
    list.innerHTML = "";

    bookings.forEach(b => {
        const resource = resources.find(r => r.id === b.resourceId)?.name || "Unknown";
        list.innerHTML += `<li>${resource} | ${b.role} | ${b.date} | <button onclick="cancelBooking(${b.id})">Cancel</button></li>`;
    });
}

/* FACULTY VIEW */
function loadFacultyBookings() {
    const list = document.getElementById("facultyBookings");
    list.innerHTML = "";

    bookings.filter(b => b.role === "faculty").forEach(b => {
        const resource = resources.find(r => r.id === b.resourceId)?.name || "Unknown";
        list.innerHTML += `<li>${resource} on ${b.date} <button onclick="cancelBooking(${b.id})">Cancel</button></li>`;
    });
}

/* STUDENT VIEW */
function loadStudentBookings() {
    const list = document.getElementById("studentBookings");
    list.innerHTML = "";

    bookings.filter(b => b.role === "student").forEach(b => {
        const resource = resources.find(r => r.id === b.resourceId)?.name || "Unknown";
        list.innerHTML += `<li>${resource} on ${b.date} <button onclick="cancelBooking(${b.id})">Cancel</button></li>`;
    });
}

/* CANCEL BOOKING */
async function cancelBooking(id) {
    await fetch(`${API_URL}/api/bookings/${id}`, { method: "DELETE" });
    loadRolePanels();
}

/* LOGOUT */
function logout() {
    location.reload();
}

/* PAGE NAVIGATION */
function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

/* ADMIN ADD RESOURCE */
function adminAddResource() {
    const name = document.getElementById("newResourceName").value;
    const type = document.getElementById("newResourceType").value;

    if (!name) return alert("Enter resource name");

    const newId = resources.length ? Math.max(...resources.map(r=>r.id))+1 : 1;
    resources.push({ id: newId, name, type });

    loadDashboard();
    alert("Resource Added Successfully");
}
