/* Riaz & Sons Solution — visual site editor (developer tool) */

function clone(o) { return JSON.parse(JSON.stringify(o || {})); }
function deepMerge(base, over) {
  if (Array.isArray(over)) return over.slice();
  if (over && typeof over === "object") {
    const out = Array.isArray(base) ? base.slice() : { ...(base || {}) };
    for (const k in over) out[k] = deepMerge(base ? base[k] : undefined, over[k]);
    return out;
  }
  return over === undefined ? base : over;
}
function loadData() {
  let over = {};
  try { over = JSON.parse(localStorage.getItem("rs_content")) || {}; } catch {}
  return deepMerge(clone(window.SITE_CONTENT || {}), over);
}
let data = loadData();

const E = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

/* one field bound to obj[key] */
function field(obj, key, opts = {}) {
  const wrap = E("div", "fld" + (opts.bool ? " bool" : ""));
  if (opts.bool) {
    const input = E("input"); input.type = "checkbox"; input.checked = !!obj[key];
    input.addEventListener("change", () => (obj[key] = input.checked));
    wrap.appendChild(input); wrap.appendChild(E("label", null, opts.label || key));
    return wrap;
  }
  wrap.appendChild(E("label", null, opts.label || key));
  const input = opts.area ? E("textarea") : E("input");
  if (!opts.area) input.type = "text";
  input.value = opts.csv ? (obj[key] || []).join(", ") : (obj[key] ?? "");
  input.addEventListener("input", () => {
    obj[key] = opts.csv ? input.value.split(",").map((s) => s.trim()).filter(Boolean) : input.value;
  });
  wrap.appendChild(input);
  if (opts.img) {
    const file = E("input"); file.type = "file"; file.accept = "image/*";
    file.addEventListener("change", (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader(); r.onload = () => { input.value = r.result; obj[key] = r.result; }; r.readAsDataURL(f);
    });
    wrap.appendChild(file);
  }
  return wrap;
}

/* list of objects with add/remove */
function listEditor(arr, fieldsDef, makeEmpty) {
  const box = E("div");
  function paint() {
    box.innerHTML = "";
    arr.forEach((item, i) => {
      const card = E("div", "item");
      card.appendChild(E("div", "ix", "#" + (i + 1)));
      const g = E("div", fieldsDef.length > 3 ? "grid2" : "");
      fieldsDef.forEach((fd) => g.appendChild(field(item, fd.k, fd)));
      card.appendChild(g);
      const rm = E("button", "rm", "Remove"); rm.onclick = () => { arr.splice(i, 1); paint(); };
      card.appendChild(rm);
      box.appendChild(card);
    });
    const add = E("button", "add", "+ Add item"); add.onclick = () => { arr.push(makeEmpty()); paint(); };
    box.appendChild(add);
  }
  paint();
  return box;
}

function section(title, tag, node) {
  const sec = E("div", "sec");
  const h = E("h2", null, title);
  if (tag) { const p = E("span", "pill", tag); h.appendChild(p); }
  sec.appendChild(h); sec.appendChild(node);
  return sec;
}
function objFields(obj, defs) { const d = E("div"); defs.forEach((fd) => d.appendChild(field(obj, fd.k, fd))); return d; }

function build() {
  const root = document.getElementById("form");
  root.innerHTML = "";
  data.brand = data.brand || {}; data.hero = data.hero || {}; data.contact = data.contact || {};
  data.hero.stats = data.hero.stats || []; data.contact.offices = data.contact.offices || [];
  data.partners = data.partners || []; data.services = data.services || []; data.leadership = data.leadership || [];
  data.projects = data.projects || []; data.gallery = data.gallery || []; data.videos = data.videos || [];
  data.walkthrough = data.walkthrough || {};

  root.appendChild(section("Brand", "logo & name", objFields(data.brand, [
    { k: "name", label: "Company name" }, { k: "tagline", label: "Tagline" }, { k: "logo", label: "Logo image", img: true },
  ])));

  const heroNode = E("div");
  heroNode.appendChild(objFields(data.hero, [
    { k: "eyebrow", label: "Eyebrow line" },
    { k: "headline", label: "Headline (wrap gold part in {gold:...})", area: true },
    { k: "lead", label: "Sub-text", area: true },
  ]));
  const statsWrap = E("div"); statsWrap.appendChild(E("label", "fld", "Stats"));
  statsWrap.appendChild(listEditor(data.hero.stats, [{ k: "value", label: "Value" }, { k: "label", label: "Label" }], () => ({ value: "", label: "" })));
  heroNode.appendChild(statsWrap);
  root.appendChild(section("Hero", "headline & stats", heroNode));

  root.appendChild(section("Contact", "phones & social", (() => {
    const d = E("div");
    d.appendChild(objFields(data.contact, [
      { k: "address", label: "Address", area: true }, { k: "landline", label: "Landline" },
      { k: "whatsapp", label: "WhatsApp (digits, e.g. 923058967537)" }, { k: "instagram", label: "Instagram handle" },
      { k: "linkedin", label: "LinkedIn company slug" }, { k: "website", label: "Website" },
    ]));
    const off = E("div"); off.appendChild(E("label", "fld", "Offices"));
    off.appendChild(listEditor(data.contact.offices.map((o) => ({ name: o })), [{ k: "name", label: "Office" }], () => ({ name: "" })));
    // keep offices in sync: rebuild array on change via proxy
    const sync = () => { data.contact.offices = Array.from(off.querySelectorAll("input[type=text]")).map((i) => i.value).filter(Boolean); };
    off.addEventListener("input", sync); off.addEventListener("click", () => setTimeout(sync, 0));
    d.appendChild(off);
    return d;
  })()));

  const partWrap = E("div");
  partWrap.appendChild(listEditor(data.partners.map((p) => ({ name: p })), [{ k: "name", label: "Partner / brand" }], () => ({ name: "" })));
  const psync = () => { data.partners = Array.from(partWrap.querySelectorAll("input[type=text]")).map((i) => i.value).filter(Boolean); };
  partWrap.addEventListener("input", psync); partWrap.addEventListener("click", () => setTimeout(psync, 0));
  root.appendChild(section("Partners / Brands", "scrolling strip", partWrap));

  root.appendChild(section("Service Departments", "cards", listEditor(data.services, [
    { k: "icon", label: "Icon (emoji)" }, { k: "gold", label: "Gold icon", bool: true },
    { k: "title", label: "Title" }, { k: "text", label: "Description", area: true }, { k: "tags", label: "Tags (comma separated)", csv: true },
  ], () => ({ icon: "🔧", gold: false, title: "", text: "", tags: [] }))));

  root.appendChild(section("Leadership", "people", listEditor(data.leadership, [
    { k: "tag", label: "Tag (e.g. Our Founder)" }, { k: "image", label: "Photo", img: true },
    { k: "name", label: "Name" }, { k: "role", label: "Role" }, { k: "bio", label: "Bio", area: true }, { k: "note", label: "Quote / note" },
  ], () => ({ tag: "Leadership", image: "assets/real-logo.jpg", name: "", role: "", bio: "", note: "" }))));

  root.appendChild(section("Projects", "showcase", listEditor(data.projects, [
    { k: "image", label: "Photo", img: true }, { k: "badge", label: "Badge: gov or prv" }, { k: "label", label: "Badge label" },
    { k: "title", label: "Title" }, { k: "text", label: "Description", area: true }, { k: "type", label: "Type line" }, { k: "year", label: "Year" },
  ], () => ({ image: "assets/lift-workshop.jpg", badge: "prv", label: "Project", title: "", text: "", type: "", year: "" }))));

  root.appendChild(section("Photo Gallery", "real / AI", listEditor(data.gallery, [
    { k: "image", label: "Photo", img: true }, { k: "tag", label: "Tag: real or ai" },
    { k: "title", label: "Title" }, { k: "caption", label: "Caption" },
  ], () => ({ image: "assets/real-logo.jpg", tag: "real", title: "", caption: "" }))));

  root.appendChild(section("Videos", "local file or YouTube Unlisted", listEditor(data.videos, [
    { k: "title", label: "Title" }, { k: "note", label: "Note (e.g. size)" }, { k: "poster", label: "Poster image", img: true },
    { k: "src", label: "Local mp4 path (optional)" }, { k: "youtube", label: "YouTube Unlisted ID (optional)" },
  ], () => ({ title: "", note: "", poster: "assets/real-logo.jpg", src: "", youtube: "" }))));

  root.appendChild(section("Walkthrough video", "Watch Walkthrough button", objFields(data.walkthrough, [
    { k: "youtube", label: "YouTube Unlisted ID (optional)" }, { k: "src", label: "Local mp4 path" }, { k: "poster", label: "Poster image", img: true },
  ])));
}

function status(msg) { const s = document.getElementById("status"); s.textContent = msg; setTimeout(() => (s.textContent = ""), 3500); }

document.getElementById("saveBtn").onclick = () => {
  localStorage.setItem("rs_content", JSON.stringify(data));
  status("Saved ✓ opening preview…");
  window.open("index.html", "_blank");
};
document.getElementById("exportBtn").onclick = () => {
  const text = "/* Riaz & Sons Solution — site content (edited in the visual editor) */\nwindow.SITE_CONTENT = " + JSON.stringify(data, null, 2) + ";\n";
  const blob = new Blob([text], { type: "text/javascript" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "content.js"; a.click();
  status("content.js downloaded ✓ — replace it in the site to publish");
};
document.getElementById("copyBtn").onclick = () => {
  navigator.clipboard?.writeText(JSON.stringify(data, null, 2)); status("JSON copied ✓");
};
document.getElementById("resetBtn").onclick = () => {
  if (!confirm("Discard your edits and reset to the original content?")) return;
  localStorage.removeItem("rs_content"); data = clone(window.SITE_CONTENT || {}); build(); status("Reset to defaults");
};

build();
