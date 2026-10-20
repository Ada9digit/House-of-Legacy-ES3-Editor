let S = null;
let fileName = "GameData.es3";
let fmt = { indent: 2, crlf: false, bom: false };

const $ = (id) => document.getElementById(id);

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ESC[m]);

const clampStr = (v, lo, hi) => {
  let n = Number(v);
  if (isNaN(n)) n = lo;
  return String(Math.min(hi, Math.max(lo, n)));
};

const setPipe = (str, i, val) => {
  const p = (str || "").split("|");
  while (p.length <= i) p.push("");
  p[i] = val;
  return p.join("|");
};

const getter = (t, row) => {
  const p = PIPE[t];
  const parts = p ? String(row[p.k] ?? "").split("|") : null;
  const fields = FIELDS[t];
  return (f) => {
    if (p && f in p.f) return parts[p.f[f]] ?? "";
    const d = fields[f];
    return d ? (row[d[0]] ?? "") : "";
  };
};

function setField(t, row, f, v) {
  const p = PIPE[t];
  if (p && f in p.f) {
    const r = PIPE_RANGE[f];
    const x = r ? clampStr(v, r[0], r[1]) : v;
    row[p.k] = setPipe(row[p.k], p.f[f], x);
    return x;
  }
  const d = FIELDS[t][f];
  if (!d) return v;
  const x = d.length > 1 ? clampStr(v, d[1], d[2]) : v;
  while (row.length < d[0]) row.push("");
  row[d[0]] = x;
  return x;
}

function gameGet(id) {
  const [k, i] = GAME[id];
  return S?.[k]?.value?.[i] ?? "";
}

function gameSet(id, v) {
  const [k, i, mode, min = 0] = GAME[id];
  if (!S[k]?.value) {
    if (k !== "CGNum") return gameGet(id);
    S.CGNum = { value: ["0", "0", "0", "0"] };
  }
  const arr = S[k].value;
  let x;
  if (mode === "t") x = v || arr[i] || "Yu";
  else {
    let n = Number(v);
    n = isNaN(n) ? 0 : Math.max(min, Math.trunc(n));
    x = mode === "s" ? String(n) : n;
  }
  arr[i] = x;
  return x;
}

function collectIds() {
  const ids = new Set();
  for (const t of ["member", "spouse", "retainer"])
    for (const r of S?.[KEY[t]]?.value || []) ids.add(String(r[0]));
  return ids;
}

function uniqueId() {
  const used = collectIds();
  let id;
  do id = "M" + Math.floor(Math.random() * 1e9) + Date.now().toString().slice(-6);
  while (used.has(id));
  return id;
}

let statusTimer;
function setStatus(msg, ok = true) {
  const el = $("status");
  el.textContent = msg;
  el.style.background = ok ? "#2c5a4a" : "#8b3c2c";
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => (el.style.background = "#2c444c"), 2000);
}
