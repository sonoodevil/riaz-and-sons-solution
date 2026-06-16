import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

/* =========================================================
   Riaz & Sons Solution — frontend app
   Telemetry + 3D sims + booking + admin + field workflows
   ========================================================= */

const API = "";
let telemetry = null;
let activeScene = "generator";

/* =========================================================
   Video config — go live by pasting a YouTube *Unlisted* ID.
   If `youtube` is "", the local MP4 plays (preload=metadata, no autoplay).
   If `youtube` is set, a privacy-friendly youtube-nocookie embed is used.
   ========================================================= */
const VIDEOS = [
  { title: "Company Clip 1",     note: "1.84 MB", poster: "assets/lift-workshop.jpg",    src: "assets/videos/company-video-01-VID-20260615-WA0036.mp4", youtube: "" },
  { title: "Company Clip 2",     note: "2.93 MB", poster: "assets/genset-equipment.jpg", src: "assets/videos/company-video-02-VID-20260615-WA0037.mp4", youtube: "" },
  { title: "Company Clip 3",     note: "2.37 MB", poster: "assets/panel-work.jpg",       src: "assets/videos/company-video-03-VID-20260615-WA0038.mp4", youtube: "" },
  { title: "Site Clip · 2022",   note: "0.78 MB", poster: "assets/site-survey.jpg",      src: "assets/videos/company-video-04-WhatsApp_Video_2022-07-15_at_4.01.13_PM_1_.mp4", youtube: "" },
  { title: "Field Clip · Jan 2023", note: "5.74 MB", poster: "assets/civil-measurement.jpg", src: "assets/videos/company-video-05-WhatsApp_Video_2023-01-04_at_19.31.00.mp4", youtube: "" },
  { title: "Field Clip · Mar 2023", note: "7.53 MB", poster: "assets/field-team-panel.jpg", src: "assets/videos/company-video-06-WhatsApp_Video_2023-03-30_at_14.39.26_1_.mp4", youtube: "" },
];
// Main "Watch Walkthrough" clip — paste an Unlisted ID to use the embed instead.
const WALKTHROUGH = { youtube: "", src: "assets/videos/company-video-01-VID-20260615-WA0036.mp4", poster: "assets/profile-board.jpg" };

function ytEmbed(id, { autoplay = false } = {}) {
  const params = `rel=0&modestbranding=1&playsinline=1${autoplay ? "&autoplay=1" : ""}`;
  return `<iframe src="https://www.youtube-nocookie.com/embed/${id}?${params}" title="Riaz & Sons real clip"
            style="width:100%;aspect-ratio:16/9;border:0;display:block" loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
}

function renderVideoGallery() {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;
  grid.innerHTML = VIDEOS.map((v) => {
    let media, tag;
    if (v.youtube) { media = ytEmbed(v.youtube); tag = "YouTube Unlisted"; }
    else if (v.src) { media = `<video controls preload="metadata" poster="${v.poster}"><source src="${v.src}" type="video/mp4" /></video>`; tag = "Real proof"; }
    else { media = `<div class="video-ph" style="background-image:url('${v.poster}')"><span>▶ Add YouTube Unlisted ID in app.js</span></div>`; tag = "Awaiting upload"; }
    return `<article class="video-card">${media}<div class="vmeta"><h3>${v.title}</h3><p>${tag} · ${v.note}</p></div></article>`;
  }).join("");
}

const $ = (id) => document.getElementById(id);

const els = {
  heroClients: $("heroClients"), heroRpm: $("heroRpm"), heroFloor: $("heroFloor"),
  heroTemp: $("heroTemp"), heroLog: $("heroLog"),
  rpmValue: $("rpmValue"), rpmMeter: $("rpmMeter"),
  voltageValue: $("voltageValue"), voltageMeter: $("voltageMeter"),
  tempValue: $("tempValue"), tempMeter: $("tempMeter"),
  fuelValue: $("fuelValue"), fuelMeter: $("fuelMeter"),
  liftFloor: $("liftFloor"), liftTarget: $("liftTarget"),
  liftDoor: $("liftDoor"), liftHealth: $("liftHealth"),
  sceneTitle: $("sceneTitle"), sceneStatus: $("sceneStatus"),
  bookingForm: $("bookingForm"), bookingStatus: $("bookingStatus"),
  requestList: $("requestList"), reportList: $("reportList"), logList: $("logList"),
};

/* ========================================================
   LOCAL MODE — makes the whole site work with NO backend
   (e.g. on GitHub Pages / cPanel static hosting). Activated
   automatically when /api/state is unreachable at boot.
   Telemetry is simulated in the browser; bookings, reports
   and logs persist in localStorage and show in the dashboard.
   ======================================================== */
let LOCAL = false;
const LSK = { req: "rs_requests", rep: "rs_reports", log: "rs_logs" };
const LS = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
function nowISO() { return new Date().toISOString(); }
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function localLog(source, level, message) {
  const logs = LS.get(LSK.log, []);
  logs.unshift({ id: logs.length + 1, source, level, message, created_at: nowISO() });
  LS.set(LSK.log, logs.slice(0, 200));
}
const localState = {
  generator: { running: false, mode: "manual", rpm: 0, voltage: 0, temperature: 29, fuel: 86, load: 0, fault: null },
  lift: { current_floor: 0, target_floor: 0, moving: false, door: "closed", health: "normal" },
  site: { active_clients: 1, last_update: nowISO() },
};
function localSimTick() {
  const g = localState.generator, l = localState.lift;
  if (g.running) {
    g.rpm = Math.min(1500, g.rpm + rnd(70, 140));
    g.voltage = Math.min(230, g.voltage + rnd(7, 17));
    g.load = Math.min(78, g.load + rnd(1, 4));
    g.temperature = Math.min(96, g.temperature + rnd(0, 2));
    g.fuel = Math.max(0, +(g.fuel - (0.02 + Math.random() * 0.06)).toFixed(2));
    if (g.temperature >= 88 && !g.fault) { g.fault = "Temperature warning"; localLog("generator", "warning", "Generator temperature crossed safe demo threshold."); }
  } else {
    g.rpm = Math.max(0, g.rpm - rnd(90, 180));
    g.voltage = Math.max(0, g.voltage - rnd(9, 22));
    g.load = Math.max(0, g.load - rnd(4, 10));
    g.temperature = Math.max(28, g.temperature - rnd(0, 2));
  }
  if (l.moving) {
    if (l.current_floor < l.target_floor) l.current_floor++;
    else if (l.current_floor > l.target_floor) l.current_floor--;
    l.door = "closed";
    if (l.current_floor === l.target_floor) { l.moving = false; l.door = "opening"; localLog("lift", "info", `Lift arrived at floor ${l.current_floor}.`); }
  } else if (l.door === "opening") l.door = "open";
  else if (l.door === "open") l.door = "closing";
  else if (l.door === "closing") l.door = "closed";
  localState.site.last_update = nowISO();
  telemetry = localState;
  updateTelemetryUI();
}
function localApi(path, body) {
  const g = localState.generator, l = localState.lift;
  if (path === "/api/generator/start") { g.running = true; g.fault = null; localLog("generator", "info", "Manual start command accepted."); }
  else if (path === "/api/generator/stop") { g.running = false; localLog("generator", "info", "Manual stop command accepted."); }
  else if (path === "/api/generator/fault") { g.fault = "Mock overload fault"; g.temperature = Math.max(g.temperature, 91); localLog("generator", "critical", "Mock overload fault triggered."); }
  else if (path === "/api/generator/reset") { g.fault = null; g.temperature = 40; localLog("generator", "info", "Generator fault reset."); }
  else if (path.startsWith("/api/lift/go/")) { const f = Math.max(0, Math.min(5, parseInt(path.split("/").pop(), 10) || 0)); l.target_floor = f; l.moving = l.current_floor !== f; l.door = "closed"; localLog("lift", "info", `Lift movement command accepted: floor ${f}.`); }
  else if (path === "/api/lift/fault") { l.health = "maintenance required"; localLog("lift", "warning", "Mock lift maintenance alert triggered."); }
  else if (path === "/api/lift/reset") { l.health = "normal"; localLog("lift", "info", "Lift maintenance alert reset."); }
  else if (path === "/api/service-requests") { const a = LS.get(LSK.req, []); const id = (a[0]?.id || 0) + 1; a.unshift({ id, ...body, status: "new", created_at: nowISO() }); LS.set(LSK.req, a); localLog("booking", "info", `New service request created: #${id}.`); return { ok: true, id }; }
  else if (path === "/api/reports") { const a = LS.get(LSK.rep, []); const id = (a[0]?.id || 0) + 1; a.unshift({ id, workflow: body.workflow, title: body.title, summary: body.summary, created_at: nowISO() }); LS.set(LSK.rep, a); localLog("report", "info", `${body.workflow} field report #${id} saved.`); return { ok: true, id }; }
  return { ok: true };
}

/* ---------- API helpers (route to local store when no backend) ---------- */
function apiPost(path, body = null) {
  if (LOCAL) return Promise.resolve(localApi(path, body));
  return fetch(API + path, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : null,
  }).then((res) => { if (!res.ok) throw new Error("http " + res.status); return res.json(); });
}
function apiPatch(path, body) {
  if (LOCAL) {
    const id = parseInt(path.split("/").pop(), 10);
    const a = LS.get(LSK.req, []); const it = a.find((x) => x.id === id); if (it) it.status = body.status; LS.set(LSK.req, a);
    localLog("booking", "info", `Service request #${id} status updated to ${body.status}.`);
    return Promise.resolve({ ok: true });
  }
  return fetch(API + path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

/* ---------- WebSocket telemetry ---------- */
function connectWebSocket() {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  const ws = new WebSocket(`${protocol}://${location.host}/ws/telemetry`);

  ws.onopen = () => {
    els.heroLog.textContent = "Connected to FastAPI WebSocket telemetry.";
    setInterval(() => { if (ws.readyState === WebSocket.OPEN) ws.send("ping"); }, 12000);
  };
  ws.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    if (payload.type === "telemetry") { telemetry = payload.data; updateTelemetryUI(); }
  };
  ws.onclose = () => {
    els.heroLog.textContent = "WebSocket disconnected. Make sure the backend is running.";
    setTimeout(connectWebSocket, 1500);
  };
}

function updateTelemetryUI() {
  if (!telemetry) return;
  const gen = telemetry.generator, lift = telemetry.lift, site = telemetry.site;

  els.heroClients.textContent = site.active_clients;
  els.heroRpm.textContent = gen.rpm;
  els.heroFloor.textContent = lift.current_floor;
  els.heroTemp.textContent = `${gen.temperature}°C`;

  els.rpmValue.textContent = gen.rpm; els.rpmMeter.value = gen.rpm;
  els.voltageValue.textContent = `${gen.voltage}V`; els.voltageMeter.value = gen.voltage;
  els.tempValue.textContent = `${gen.temperature}°C`; els.tempMeter.value = gen.temperature;
  els.fuelValue.textContent = `${Math.round(gen.fuel)}%`; els.fuelMeter.value = gen.fuel;

  els.liftFloor.textContent = lift.current_floor;
  els.liftTarget.textContent = lift.target_floor;
  els.liftDoor.textContent = lift.door;
  els.liftHealth.textContent = lift.health;

  const fault = gen.fault ? ` | Fault: ${gen.fault}` : "";
  els.heroLog.textContent =
    `Genset: ${gen.running ? "RUNNING" : "IDLE"} | ${gen.rpm} RPM | ${gen.voltage}V | ${gen.temperature}°C${fault}\n` +
    `Lift: Floor ${lift.current_floor} → ${lift.target_floor} | ${lift.moving ? "MOVING" : "READY"} | Door: ${lift.door}\n` +
    `Last backend update: ${site.last_update}`;

  if (activeScene === "generator") {
    els.sceneTitle.textContent = "Generator Simulation";
    els.sceneStatus.textContent = gen.fault || (gen.running ? "Running" : "Idle");
  } else {
    els.sceneTitle.textContent = "Lift Simulation";
    els.sceneStatus.textContent = lift.health !== "normal" ? lift.health : (lift.moving ? "Moving" : `Floor ${lift.current_floor}`);
  }
}

/* ---------- Lab controls ---------- */
document.querySelectorAll("[data-api]").forEach((button) => {
  button.addEventListener("click", async () => {
    button.disabled = true;
    try { await apiPost(button.dataset.api); await loadAdminData(); }
    finally { button.disabled = false; }
  });
});
document.querySelectorAll("[data-floor]").forEach((button) => {
  button.addEventListener("click", async () => {
    await apiPost(`/api/lift/go/${button.dataset.floor}`);
    await loadAdminData();
  });
});
document.querySelectorAll("[data-scene]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-scene]").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    activeScene = button.dataset.scene;
    updateTelemetryUI();
  });
});

/* ---------- Booking ---------- */
const WHATSAPP_NUMBER = "923058967537"; // company WhatsApp

function whatsappBookingURL(d) {
  const text =
    `Salam, I want to book a service from Riaz & Sons Solution.\n` +
    `Name: ${d.name}\nPhone: ${d.phone}\nService: ${d.service_type}\n` +
    `Location: ${d.location}\nDetails: ${d.details}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

els.bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(els.bookingForm).entries());
  els.bookingStatus.textContent = "Submitting your request…";
  try {
    // Try the backend first (saves to SQLite + admin dashboard)
    const response = await apiPost("/api/service-requests", data);
    if (!response || response.ok === false) throw new Error("no backend");
    if (LOCAL) {
      els.bookingStatus.textContent = `✓ Saved to dashboard (#${response.id}). Opening WhatsApp to send it to Riaz & Sons Solution…`;
      window.open(whatsappBookingURL(data), "_blank");
    } else {
      els.bookingStatus.textContent = `✓ Saved to backend. Request ID: ${response.id}`;
    }
    els.bookingForm.reset();
    await loadAdminData();
  } catch (error) {
    // No backend (e.g. live static site) → send the booking via WhatsApp
    els.bookingStatus.textContent = "✓ Opening WhatsApp to send your booking to Riaz & Sons Solution…";
    window.open(whatsappBookingURL(data), "_blank");
    els.bookingForm.reset();
  }
});

/* ---------- Admin ---------- */
$("refreshAdmin").addEventListener("click", loadAdminData);

async function loadAdminData() {
  if (LOCAL) {
    renderRequests(LS.get(LSK.req, []));
    renderReports(LS.get(LSK.rep, []));
    renderLogs(LS.get(LSK.log, []));
    return;
  }
  try {
    const [requests, reports, logs] = await Promise.all([
      fetch("/api/service-requests").then((r) => r.json()),
      fetch("/api/reports").then((r) => r.json()),
      fetch("/api/logs").then((r) => r.json()),
    ]);
    renderRequests(requests);
    renderReports(reports);
    renderLogs(logs);
  } catch (error) {
    els.requestList.innerHTML = `<p class="muted">Backend data unavailable.</p>`;
    els.reportList.innerHTML = `<p class="muted">Backend reports unavailable.</p>`;
    els.logList.innerHTML = `<p class="muted">Backend logs unavailable.</p>`;
  }
}

function renderRequests(requests) {
  if (!requests.length) { els.requestList.innerHTML = `<p class="muted">No service requests yet. Submit the booking form.</p>`; return; }
  els.requestList.innerHTML = "";
  requests.forEach((request) => {
    const card = document.createElement("article");
    card.className = "request-card";
    card.innerHTML = `
      <h4>#${request.id} — ${escapeHtml(request.service_type)}</h4>
      <p><strong>${escapeHtml(request.name)}</strong> • ${escapeHtml(request.phone)}</p>
      <p>${escapeHtml(request.location)} — ${escapeHtml(request.details)}</p>
      <small>Status: ${escapeHtml(request.status)} • ${new Date(request.created_at).toLocaleString()}</small>
      <div class="status-actions">
        <button data-status="new">New</button>
        <button data-status="contacted">Contacted</button>
        <button data-status="progress">Progress</button>
        <button data-status="completed">Completed</button>
      </div>`;
    card.querySelectorAll("[data-status]").forEach((button) => {
      button.addEventListener("click", async () => {
        await apiPatch(`/api/service-requests/${request.id}`, { status: button.dataset.status });
        await loadAdminData();
      });
    });
    els.requestList.appendChild(card);
  });
}

function renderReports(reports) {
  if (!reports || !reports.length) { els.reportList.innerHTML = `<p class="muted">No field reports yet. Generate one in the Workflows section.</p>`; return; }
  els.reportList.innerHTML = reports.map((r) => `
    <article class="report-card">
      <div class="wf">${escapeHtml(r.workflow)} report</div>
      <h4>#${r.id} — ${escapeHtml(r.title)}</h4>
      <p>${escapeHtml(r.summary)}</p>
      <small class="muted">${new Date(r.created_at).toLocaleString()}</small>
    </article>`).join("");
}

function renderLogs(logs) {
  if (!logs.length) { els.logList.innerHTML = `<p class="muted">No logs yet.</p>`; return; }
  els.logList.innerHTML = logs.map((log) => `
    <article class="log-card" data-level="${escapeHtml(log.level)}">
      <p><strong>${escapeHtml(log.source.toUpperCase())}</strong> — ${escapeHtml(log.level)}</p>
      <p>${escapeHtml(log.message)}</p>
      <small>${new Date(log.created_at).toLocaleString()}</small>
    </article>`).join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]);
}

/* =========================================================
   Field reporting workflows
   ========================================================= */
const num = (id) => parseFloat($(id)?.value) || 0;
const checked = (id) => !!($(id) && $(id).checked);
const txt = (id) => ($(id)?.value || "").trim();

/* Tab switching */
document.querySelectorAll(".wf-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const wf = tab.dataset.wf;
    document.querySelectorAll(".wf-tab").forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".wf-panel").forEach((p) => p.classList.toggle("active", p.dataset.panel === wf));
  });
});

/* Live recalculation on any input within #workflows */
const wfSection = $("workflows");
if (wfSection) wfSection.addEventListener("input", recalcAll);

const calculators = {
  lift() {
    const cabin = num("lf_cabinW") * num("lf_cabinD");
    const shaft = num("lf_shaftW") * num("lf_shaftD");
    const clearW = (num("lf_shaftW") - num("lf_cabinW")) * 1000 / 2;
    const clearD = (num("lf_shaftD") - num("lf_cabinD")) * 1000 / 2;
    const checks = ["lf_access","lf_barricade","lf_door","lf_level","lf_alarm"].filter(checked).length;
    set("lf_cabinArea", `${cabin.toFixed(2)} m²`);
    set("lf_shaftArea", `${shaft.toFixed(2)} m²`);
    set("lf_clear", `${Math.max(0, Math.min(clearW, clearD)).toFixed(0)} mm`);
    set("lf_checks", `${checks}/5`);
    return { cabin, shaft, clearW, clearD, checks };
  },
  genset() {
    const v = num("gn_volt"), a = num("gn_amp");
    const kva1 = (v * a) / 1000;
    const kw3 = (Math.sqrt(3) * v * a * 0.8) / 1000;
    const fault = checked("gn_fault");
    let status = "Healthy", cls = "risk-low";
    if (fault || num("gn_temp") >= 95 || num("gn_fuel") < 15 || num("gn_batt") < 11.8) { status = "Attention"; cls = "risk-high"; }
    else if (num("gn_temp") >= 88 || num("gn_load") > 90 || num("gn_oil") !== 0) { status = "Watch"; cls = "risk-med"; }
    set("gn_kva", `${kva1.toFixed(1)} kVA`);
    set("gn_kw", `${kw3.toFixed(1)} kW`);
    set("gn_status", status, cls);
    return { kva1, kw3, status };
  },
  hvac() {
    const L = num("hv_l"), W = num("hv_w"), H = num("hv_h");
    const area = L * W, vol = area * H;
    const areaSqft = area * 10.7639;
    // rough field rule: ~600 BTU/hr per m² + 600 BTU per person, height-adjusted
    let btu = area * 600 + num("hv_people") * 600;
    if (H > 3) btu *= 1 + (H - 3) * 0.1;
    const tons = btu / 12000;
    set("hv_area", `${area.toFixed(1)} m² (${areaSqft.toFixed(0)} ft²)`);
    set("hv_vol", `${vol.toFixed(1)} m³`);
    set("hv_btu", `${Math.round(btu).toLocaleString()} BTU/hr`);
    set("hv_tons", `${tons.toFixed(1)} ton`);
    return { area, vol, btu, tons };
  },
  civil() {
    const L = num("cv_l"), W = num("cv_w"), H = num("cv_h");
    const floor = L * W;
    const wall = 2 * (L + W) * H;
    const paint = Math.max(0, wall + floor - num("cv_deduct")); // walls + ceiling - openings
    const tileM = num("cv_tile") / 100;
    const tileArea = tileM * tileM;
    const waste = 1 + num("cv_waste") / 100;
    const tiles = tileArea > 0 ? Math.ceil((floor / tileArea) * waste) : 0;
    set("cv_floor", `${floor.toFixed(2)} m²`);
    set("cv_wall", `${wall.toFixed(2)} m²`);
    set("cv_paint", `${paint.toFixed(2)} m²`);
    set("cv_tiles", `${tiles} pcs`);
    return { floor, wall, paint, tiles };
  },
  electrical() {
    const v = num("el_volt"), a = num("el_amp");
    const phase = parseInt($("el_phase")?.value || "1", 10);
    const pf = 0.85;
    const kw = phase === 3 ? (Math.sqrt(3) * v * a * pf) / 1000 : (v * a * pf) / 1000;
    const loading = num("el_breaker") > 0 ? (a / num("el_breaker")) * 100 : 0;
    let cable = "1.5 mm²";
    if (a > 10) cable = "2.5 mm²";
    if (a > 20) cable = "4 mm²";
    if (a > 27) cable = "6 mm²";
    if (a > 36) cable = "10 mm²";
    if (a > 50) cable = "16 mm²";
    if (a > 68) cable = "25 mm²";
    const db = $("el_db")?.value || "Good";
    let risk = "Low", cls = "risk-low";
    if (db === "Damaged" || db === "Overheating signs" || loading > 90) { risk = "High"; cls = "risk-high"; }
    else if (db === "Loose terminals" || loading > 75) { risk = "Medium"; cls = "risk-med"; }
    set("el_power", `${kw.toFixed(2)} kW`);
    set("el_loading", `${loading.toFixed(0)} %`);
    set("el_cableSize", cable);
    set("el_risk", risk, cls);
    return { kw, loading, cable, risk };
  },
};

function set(id, value, riskClass) {
  const el = $(id); if (!el) return;
  el.textContent = value;
  el.classList.remove("risk-low", "risk-med", "risk-high");
  if (riskClass) el.classList.add(riskClass);
}

function recalcAll() {
  Object.values(calculators).forEach((fn) => { try { fn(); } catch (e) {} });
}

/* ---------- Report generation ---------- */
const reportBuilders = {
  lift() {
    const c = calculators.lift();
    const checks = [["Site access","lf_access"],["Safety barricade","lf_barricade"],["Door sensor","lf_door"],["Leveling","lf_level"],["Alarm / intercom","lf_alarm"]]
      .map(([n, id]) => `   - ${n}: ${checked(id) ? "PASS ✓" : "PENDING"}`).join("\n");
    const title = `Lift report — ${txt("lf_site") || "site"}`;
    const summary = `${c.checks}/5 checks passed · cabin ${c.cabin.toFixed(2)} m² · ${num("lf_floors")} floors`;
    const body =
`RIAZ & SONS SOLUTION — LIFT / ELEVATOR FIELD REPORT
Site: ${txt("lf_site") || "—"}   Floors served: ${num("lf_floors")}
Complaint: ${txt("lf_complaint") || "—"}

MEASUREMENTS
   Cabin: ${num("lf_cabinW")} × ${num("lf_cabinD")} m  =  ${c.cabin.toFixed(2)} m²
   Shaft: ${num("lf_shaftW")} × ${num("lf_shaftD")} m  =  ${c.shaft.toFixed(2)} m²
   Pit depth: ${num("lf_pit")} m   Overhead: ${num("lf_overhead")} m
   Min side clearance: ${Math.max(0, Math.min(c.clearW, c.clearD)).toFixed(0)} mm

SAFETY & FUNCTION CHECKS (${c.checks}/5)
${checks}

ENGINEER NOTES
   ${txt("lf_notes") || "—"}`;
    return { workflow: "lift", title, summary, body, payload: { complaint: txt("lf_complaint"), site: txt("lf_site"), floors: num("lf_floors"), cabin_area: c.cabin, shaft_area: c.shaft, pit: num("lf_pit"), overhead: num("lf_overhead"), checks: c.checks } };
  },
  genset() {
    const c = calculators.genset();
    const seq = [["Isolator ON","gn_s1"],["Fuel valve open","gn_s2"],["Pre-heat/glow","gn_s3"],["Crank & start","gn_s4"]]
      .map(([n, id]) => `   - ${n}: ${checked(id) ? "DONE ✓" : "—"}`).join("\n");
    const title = `Genset report — ${c.status}`;
    const summary = `${c.status} · ${c.kw3.toFixed(1)} kW · ${num("gn_load")}% load · ${num("gn_temp")}°C`;
    const body =
`RIAZ & SONS SOLUTION — GENSET / GENERATOR FIELD REPORT
PRE-CHECKS
   Fuel: ${num("gn_fuel")}%   Battery: ${num("gn_batt")} V   Oil: ${$("gn_oil")?.value}

MANUAL START SEQUENCE
${seq}
   Fault present: ${checked("gn_fault") ? "YES — reset required" : "No"}

LIVE READINGS
   RPM: ${num("gn_rpm")}   Voltage: ${num("gn_volt")} V   Current: ${num("gn_amp")} A/phase
   Temperature: ${num("gn_temp")} °C   Load: ${num("gn_load")}%
   Apparent power (1-ph): ${c.kva1.toFixed(1)} kVA
   Estimated 3-phase power: ${c.kw3.toFixed(1)} kW
   HEALTH STATUS: ${c.status}

ENGINEER NOTES
   ${txt("gn_notes") || "—"}`;
    return { workflow: "genset", title, summary, body, payload: { fuel: num("gn_fuel"), battery: num("gn_batt"), rpm: num("gn_rpm"), voltage: num("gn_volt"), current: num("gn_amp"), temperature: num("gn_temp"), load: num("gn_load"), kw: c.kw3, status: c.status, fault: checked("gn_fault") } };
  },
  hvac() {
    const c = calculators.hvac();
    const chk = [["Filter","hv_filter"],["Coil","hv_coil"],["Drain","hv_drain"],["Airflow","hv_air"],["Outdoor unit","hv_outdoor"]]
      .map(([n, id]) => `   - ${n}: ${checked(id) ? "OK ✓" : "PENDING"}`).join("\n");
    const title = `HVAC report — ${c.tons.toFixed(1)} ton`;
    const summary = `${c.area.toFixed(1)} m² · ${Math.round(c.btu).toLocaleString()} BTU/hr · ~${c.tons.toFixed(1)} ton`;
    const body =
`RIAZ & SONS SOLUTION — HVAC FIELD REPORT
ROOM
   ${num("hv_l")} × ${num("hv_w")} × ${num("hv_h")} m   Occupancy: ${num("hv_people")} persons
   Floor area: ${c.area.toFixed(1)} m² (${(c.area*10.7639).toFixed(0)} ft²)   Volume: ${c.vol.toFixed(1)} m³

COOLING ESTIMATE (rough field rule — confirm with full heat-load survey)
   Cooling load: ${Math.round(c.btu).toLocaleString()} BTU/hr
   Suggested capacity: ~${c.tons.toFixed(1)} ton

COMPONENT CHECKLIST
${chk}

PIPE ROUTE NOTES
   ${txt("hv_pipe") || "—"}`;
    return { workflow: "hvac", title, summary, body, payload: { length: num("hv_l"), width: num("hv_w"), height: num("hv_h"), area: c.area, volume: c.vol, btu: c.btu, tons: c.tons, pipe: txt("hv_pipe") } };
  },
  civil() {
    const c = calculators.civil();
    const title = `Civil report — ${c.floor.toFixed(1)} m² floor`;
    const summary = `Floor ${c.floor.toFixed(1)} m² · paint ${c.paint.toFixed(1)} m² · ${c.tiles} tiles`;
    const cond = `${checked("cv_crack") ? "Cracks observed; " : ""}${checked("cv_damp") ? "Dampness observed; " : ""}` || "No defects flagged";
    const body =
`RIAZ & SONS SOLUTION — CIVIL WORKS FIELD REPORT
DIMENSIONS
   Floor: ${num("cv_l")} × ${num("cv_w")} m   Wall height: ${num("cv_h")} m
   Door/Window deduction: ${num("cv_deduct")} m²

QUANTITIES
   Floor / tile area: ${c.floor.toFixed(2)} m²
   Wall area: ${c.wall.toFixed(2)} m²
   Paint area (walls + ceiling − openings): ${c.paint.toFixed(2)} m²
   Tile: ${num("cv_tile")}×${num("cv_tile")} cm — ${c.tiles} pcs (incl. ${num("cv_waste")}% wastage)

CONDITION CHECK
   ${checked("cv_crack") || checked("cv_damp") ? cond : "No cracks or dampness observed"}

ENGINEER NOTES
   ${txt("cv_notes") || "—"}`;
    return { workflow: "civil", title, summary, body, payload: { floor: c.floor, wall: c.wall, paint: c.paint, tiles: c.tiles, wastage: num("cv_waste"), crack: checked("cv_crack"), damp: checked("cv_damp") } };
  },
  electrical() {
    const c = calculators.electrical();
    const title = `Electrical report — risk ${c.risk}`;
    const summary = `${c.kw.toFixed(2)} kW · breaker ${c.loading.toFixed(0)}% · cable ${c.cable} · risk ${c.risk}`;
    const body =
`RIAZ & SONS SOLUTION — ELECTRICAL WORKS FIELD REPORT
⚠ SAFETY: Verify isolation & lock-out before any DB/panel work.

DB & RATINGS
   DB visual: ${$("el_db")?.value}
   Main breaker: ${num("el_breaker")} A   Supply: ${$("el_phase")?.value === "3" ? "Three phase" : "Single phase"}

READINGS
   Voltage: ${num("el_volt")} V   Current: ${num("el_amp")} A
   Active power (est, PF 0.85): ${c.kw.toFixed(2)} kW
   Breaker loading: ${c.loading.toFixed(0)}%
   Cable route length: ${num("el_cable")} m
   Suggested cable size: ${c.cable}

EARTHING
   ${txt("el_earth") || "—"}

RISK LEVEL: ${c.risk}

MATERIAL REQUIREMENT
   ${txt("el_material") || "—"}`;
    return { workflow: "electrical", title, summary, body, payload: { db: $("el_db")?.value, breaker: num("el_breaker"), voltage: num("el_volt"), current: num("el_amp"), cable_length: num("el_cable"), kw: c.kw, loading: c.loading, cable: c.cable, risk: c.risk } };
  },
};

document.querySelectorAll("[data-report]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const wf = btn.dataset.report;
    const builder = reportBuilders[wf];
    if (!builder) return;
    const report = builder();
    openReport(report);
    const status = $("reportSaveStatus");
    status.textContent = "Saving to backend…";
    try {
      const res = await apiPost("/api/reports", { workflow: report.workflow, title: report.title, summary: report.summary, payload: report.payload });
      status.textContent = `✓ Saved to backend records as report #${res.id}.`;
      await loadAdminData();
    } catch (e) {
      status.textContent = "Saved locally (backend offline — report still shown above).";
    }
  });
});

/* ---------- Report modal ---------- */
function openReport(report) {
  $("reportTitle").textContent = report.title;
  $("reportBody").textContent = report.body;
  $("reportSaveStatus").textContent = "";
  setModal("reportModal", true);
}
$("copyReportBtn")?.addEventListener("click", () => {
  navigator.clipboard?.writeText($("reportBody").textContent || "").then(() => {
    $("copyReportBtn").textContent = "Copied ✓";
    setTimeout(() => ($("copyReportBtn").textContent = "Copy report"), 1500);
  });
});

/* =========================================================
   3D simulation (generator + lift)
   ========================================================= */
const canvas = $("threeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x050b1d, 12, 34);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(6, 5, 9);
camera.lookAt(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xbcd8ff, 0x16243f, 1.7));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(6, 8, 4);
scene.add(keyLight);
const goldFill = new THREE.PointLight(0xe6c258, 1.1, 40);
goldFill.position.set(-6, 4, 5);
scene.add(goldFill);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(9, 96),
  new THREE.MeshStandardMaterial({ color: 0x0a1730, roughness: 0.85, metalness: 0.1 })
);
floor.rotation.x = -Math.PI / 2; floor.position.y = -1.55;
scene.add(floor);
const grid = new THREE.GridHelper(18, 18, 0x3b6aa8, 0x16294a);
grid.position.y = -1.52; scene.add(grid);

const generatorGroup = new THREE.Group();
const liftGroup = new THREE.Group();
scene.add(generatorGroup, liftGroup);

const matBlue = new THREE.MeshStandardMaterial({ color: 0x2f80ed, roughness: 0.42, metalness: 0.35 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x0f1b33, roughness: 0.55, metalness: 0.3 });
const matGold = new THREE.MeshStandardMaterial({ color: 0xd6af52, roughness: 0.28, metalness: 0.5 });
const matRed = new THREE.MeshStandardMaterial({ color: 0xff5b6e, roughness: 0.35, metalness: 0.2 });
const matGreen = new THREE.MeshStandardMaterial({ color: 0x34d39b, roughness: 0.35, metalness: 0.25 });

function makeBox(w, h, d, mat, x, y, z) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return m; }
function makeCyl(r, h, mat, x, y, z, rz = 0) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 48), mat); m.position.set(x, y, z); m.rotation.z = rz; return m; }

/* Generator */
generatorGroup.add(makeBox(4.4, 1.8, 2.4, matBlue, 0, 0, 0));
generatorGroup.add(makeBox(4.8, .32, 2.8, matDark, 0, -1.1, 0));
generatorGroup.add(makeBox(1.25, 1.1, 2.55, matGold, -2.9, -.16, 0));
generatorGroup.add(makeBox(.9, 1.05, 1.8, matDark, 2.45, -.1, 0));
generatorGroup.add(makeCyl(.46, 2.85, matDark, -1.45, -1.32, 1.35, Math.PI / 2));
generatorGroup.add(makeCyl(.46, 2.85, matDark, 1.45, -1.32, 1.35, Math.PI / 2));
generatorGroup.add(makeCyl(.18, 1.8, matGold, 0, 1.18, 0, Math.PI / 2));
const rotor = new THREE.Group();
rotor.add(makeCyl(.35, .55, matGreen, 0, 0, 0, Math.PI / 2));
rotor.add(makeBox(1.45, .13, .18, matGreen, 0, 0, 0));
rotor.add(makeBox(.13, 1.45, .18, matGreen, 0, 0, 0));
rotor.position.set(2.98, .25, 0);
generatorGroup.add(rotor);
const warningLight = new THREE.Mesh(new THREE.SphereGeometry(.16, 32, 16), matGreen);
warningLight.position.set(-2.85, .82, 1.25);
generatorGroup.add(warningLight);

/* Lift */
const shaftMat = new THREE.MeshStandardMaterial({ color: 0x5f86c8, roughness: .35, metalness: .2, transparent: true, opacity: .32 });
const cabinMat = new THREE.MeshStandardMaterial({ color: 0xd6af52, roughness: .38, metalness: .45 });
const lineMat = new THREE.LineBasicMaterial({ color: 0x8cc7ff });
liftGroup.add(makeBox(2.5, 7.2, 2.5, shaftMat, 0, 1.8, 0));
const liftCabin = makeBox(1.8, 1.05, 1.55, cabinMat, 0, -1.05, 0);
liftGroup.add(liftCabin);
for (let i = 0; i <= 5; i++) {
  const y = -1.1 + i * 1.25;
  const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.2, y, -1.4), new THREE.Vector3(2.2, y, -1.4)]);
  liftGroup.add(new THREE.Line(g, lineMat));
  liftGroup.add(makeBox(.5, .06, .08, matGreen, -1.65, y, -1.48));
}
liftGroup.visible = false;

function resizeRenderer() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width);
  const height = Math.max(440, rect.height);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resizeRenderer);
resizeRenderer();

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  resizeRenderer();
  t += 0.016;
  const gen = telemetry?.generator, lift = telemetry?.lift;
  generatorGroup.visible = activeScene === "generator";
  liftGroup.visible = activeScene === "lift";

  if (gen) {
    const speed = gen.running ? Math.max(0.05, gen.rpm / 180) : 0.01;
    rotor.rotation.x += speed * 0.04;
    generatorGroup.rotation.y += 0.003;
    warningLight.material = gen.fault ? matRed : (gen.running ? matGreen : matGold);
  } else {
    generatorGroup.rotation.y += 0.003;
  }
  if (lift) {
    const targetY = -1.05 + lift.current_floor * 1.25;
    liftCabin.position.y += (targetY - liftCabin.position.y) * 0.08;
    liftGroup.rotation.y = Math.sin(t * 0.4) * 0.12;
  }
  renderer.render(scene, camera);
}

/* =========================================================
   Modals + nav
   ========================================================= */
function setModal(id, open) {
  const modal = $(id); if (!modal) return;
  modal.classList.toggle("open", open);
  modal.setAttribute("aria-hidden", open ? "false" : "true");
  if (!open) { const v = modal.querySelector("video"); if (v) v.pause(); }
}

function fillWalkMedia(open) {
  const box = $("walkMedia");
  if (!box) return;
  if (open) {
    if (WALKTHROUGH.youtube) box.innerHTML = ytEmbed(WALKTHROUGH.youtube, { autoplay: true });
    else if (WALKTHROUGH.src) box.innerHTML = `<video id="walkVideo" controls preload="metadata" poster="${WALKTHROUGH.poster}"><source src="${WALKTHROUGH.src}" type="video/mp4" /></video>`;
    else box.innerHTML = `<div class="video-ph" style="background-image:url('${WALKTHROUGH.poster}');aspect-ratio:16/9"><span>▶ Add the walkthrough YouTube Unlisted ID in app.js (WALKTHROUGH)</span></div>`;
    const v = box.querySelector("video");
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  } else {
    box.innerHTML = ""; // unmounts the iframe/video → stops playback
  }
}

$("openWalkthrough")?.addEventListener("click", () => { fillWalkMedia(true); setModal("walkModal", true); });
$("closeWalkthroughBtn")?.addEventListener("click", () => { setModal("walkModal", false); fillWalkMedia(false); });
$("closeReportBtn")?.addEventListener("click", () => setModal("reportModal", false));
document.querySelectorAll("[data-close-walk]").forEach((el) => el.addEventListener("click", () => { setModal("walkModal", false); fillWalkMedia(false); }));
document.querySelectorAll("[data-close-report]").forEach((el) => el.addEventListener("click", () => setModal("reportModal", false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { setModal("walkModal", false); fillWalkMedia(false); setModal("reportModal", false); } });

/* Mobile nav */
const navToggle = $("navToggle"), primaryNav = $("primaryNav");
navToggle?.addEventListener("click", () => primaryNav.classList.toggle("open"));
primaryNav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => primaryNav.classList.remove("open")));

/* ---------- Boot ---------- */
renderVideoGallery();
recalcAll();
animate();

// Detect backend; fall back to in-browser LOCAL mode for static hosting.
fetch(API + "/api/state", { cache: "no-store" })
  .then((res) => { if (!res.ok) throw new Error("no backend"); return res.json(); })
  .then(() => { LOCAL = false; connectWebSocket(); loadAdminData(); })
  .catch(() => {
    LOCAL = true;
    document.body.classList.add("local-mode");
    if (!LS.get(LSK.log, []).length) localLog("system", "info", "Local demo mode started — telemetry simulated in browser.");
    els.heroLog.textContent = "Local demo mode — live telemetry is simulated in your browser (no backend needed).";
    telemetry = localState;
    updateTelemetryUI();
    setInterval(localSimTick, 1000);
    loadAdminData();
  });
