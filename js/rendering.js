const cell = (val, t, i, f, kind = "t") => {
  const attrs = `class="ii" data-t="${t}" data-i="${i}" data-f="${f}"`;
  if (kind === "n") return `<td><input ${attrs} type="number" value="${esc(val)}"></td>`;
  if (kind === "t") return `<td><input ${attrs} type="text" value="${esc(val)}"></td>`;
  if (kind === "r") return `<td><input ${attrs} type="text" value="${esc(val)}" readonly></td>`;
  const opts = OPT[kind];
  const cur = String(val);
  const extra = cur in opts ? "" : `<option value="${esc(cur)}" selected>${esc(cur)}</option>`;
  const list = Object.entries(opts)
    .map(([k, v]) => `<option value="${k}"${cur === k ? " selected" : ""}>${v}</option>`)
    .join("");
  return `<td><select ${attrs}>${extra}${list}</select></td>`;
};

function renderTable(t) {
  const el = $(TABLE_EL[t]);
  const rows = S?.[KEY[t]]?.value;
  if (!rows?.length) {
    el.innerHTML = '<p class="empty">No data. Load a save or add entries above.</p>';
    return;
  }
  const cols = COLS[t];
  const head = cols.map((c) => `<th>${c[0]}</th>`).join("") + "<th></th>";
  const body = rows
    .map((r, i) => {
      const g = getter(t, r);
      return `<tr>${cols.map(([, f, k]) => cell(g(f), t, i, f, k)).join("")}<td><button class="del" data-a="del" data-t="${t}" data-i="${i}">🗑️</button></td></tr>`;
    })
    .join("");
  el.innerHTML = `<div class="tbl-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderGameData() {
  if (!S) return;
  $("gameForm").innerHTML = GAME_FORM.map(
    ([label, type, id]) =>
      `<div class="field"><label>${label}</label><input type="${type}" data-t="game" data-f="${id}" value="${esc(gameGet(id))}"></div>`,
  ).join("");
}

function renderAll() {
  renderGameData();
  for (const t of Object.keys(KEY)) renderTable(t);
}

const btn = (a, label, cls, arg) =>
  `<button class="${cls}" data-a="${a}"${arg ? ` data-arg="${arg}"` : ""}>${label}</button>`;
const tabBody = (buttons, id) => `<div class="card"><div class="row">${buttons}</div><div id="${id}"></div></div>`;

const itemRef = `<details class="card ref"><summary>📖 Item Reference</summary><div class="refgrid">${ITEM_REF.map(
  ([title, lines]) => `<div class="refbox"><div class="reft">${title}</div>${lines.map((l) => `<div>${l}</div>`).join("")}</div>`,
).join("")}</div></details>`;

const TABS = [
  { id: "game", label: "📊 Game Data", html: `<div class="card"><div class="grid" id="gameForm"></div><div class="row" style="margin-top:14px">${btn("maxGame", "✨ Max Money / Reputation / Level", "btn-max")}</div></div>` },
  { id: "member", label: "👥 Members", html: tabBody(btn("max", "⚡ Max all stats (age 21, all 100)", "btn-max", "member"), "memberTbl") },
  { id: "spouse", label: "💍 Spouses", html: tabBody(btn("max", "⚡ Max all spouse stats", "btn-max", "spouse"), "spouseTbl") },
  { id: "retainer", label: "🗡️ Retainers", html: tabBody(btn("max", "⚡ Max retainers + zero fee", "btn-max", "retainer") + btn("addRetainer", "📜 Add Retainer", "btn-add"), "retainerTbl") },
  { id: "inventory", label: "📦 Inventory", html: tabBody(btn("addAllItems", `📦 Add ALL Items (0-${MAX_ITEM_ID}, 999,999 each)`, "btn-add") + btn("addItem", "➕ Add Custom Slot", "btn-add"), "inventoryTbl") + itemRef },
  { id: "horse", label: "🐎 Horses", html: tabBody(btn("addHorse", "🐴 Add Horse", "btn-add") + btn("max", "⚡ Max all horses (age 5, stats 99)", "btn-max", "horse"), "horseTbl") },
];

(function initLayout() {
  const tabsEl = $("tabs"), panelsEl = $("panels");
  tabsEl.innerHTML = TABS.map((t, i) => `<button class="tab${i ? "" : " active"}" data-tab="${t.id}">${t.label}</button>`).join("");
  panelsEl.innerHTML = TABS.map((t, i) => `<div id="${t.id}-pane" class="pane${i ? "" : " active"}">${t.html}</div>`).join("");
  tabsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    document.querySelectorAll(".tab.active, .pane.active").forEach((n) => n.classList.remove("active"));
    b.classList.add("active");
    $(b.dataset.tab + "-pane").classList.add("active");
  });
})();
