function normalizeData() {
  for (const m of S.Member_now?.value || []) {
    for (const i of [13, 40]) if (m[i] !== undefined && typeof m[i] !== "string") m[i] = String(m[i]);
  }
  for (const h of S.Horse_Have?.value || [])
    while (h.length < 7) h.push(h.length === 6 ? "null" : "0");
}

function autoMaxGame() {
  gameSet("gold", "999999999");
  gameSet("ingot", "999999");
  gameSet("flevel", "80");
  gameSet("frep", "1600");
  renderGameData();
}

function autoMax(t) {
  const rows = S[KEY[t]]?.value;
  if (!rows) return;
  if (t === "horse") {
    for (const h of rows) {
      while (h.length < 7) h.push(h.length === 6 ? "null" : "6");
      h[1] = "5"; h[2] = "25"; h[3] = h[4] = h[5] = "99";
    }
  } else {
    const kv = [...STATS.map((s) => [s, "100"]), ...Object.entries(MAX_SET[t])];
    for (const r of rows) for (const [f, v] of kv) setField(t, r, f, v);
  }
  renderTable(t);
}

function addRetainer() {
  const list = (S.MenKe_Now ??= { value: [] }).value;
  const r = new Array(22).fill("");
  const set = (f, v) => setField("retainer", r, f, v);
  r[0] = uniqueId();
  r[1] = DEFAULT_PORTRAIT;
  r[2] = NEW_RETAINER_F4;
  set("age", "21"); set("health", "100"); set("stamina", "100"); set("mood", "50");
  for (const f of ["rep", "charm", "lit", "mar", "com", "art", "cunning"]) set(f, "50");
  set("fee", "0");
  set("pregnancy", "-1");
  list.push(r);
  renderTable("retainer");
}

function addHorse() {
  (S.Horse_Have ??= { value: [] }).value.push(["6", "3", "25", "50", "50", "50", "null"]);
  renderTable("horse");
}

const ensureInv = () => (S.Prop_have ??= { __type: INV_TYPE, value: [] }).value;

function addAllItems() {
  const inv = ensureInv();
  const have = new Map(inv.map((r) => [String(r[0]), r]));
  for (let id = 0; id <= MAX_ITEM_ID; id++) {
    const r = have.get(String(id));
    if (r) r[1] = "999999";
    else inv.push([String(id), "999999"]);
  }
  renderTable("inv");
  setStatus(`Set all items 0-${MAX_ITEM_ID} to 999,999.`);
}

function addItem() {
  ensureInv().push(["0", "1"]);
  renderTable("inv");
}

function deleteRow({ t, i }) {
  S[KEY[t]]?.value.splice(+i, 1);
  renderTable(t);
}

function doSave() {
  let out = JSON.stringify(S, null, fmt.indent);
  if (fmt.crlf) out = out.replace(/\n/g, "\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([(fmt.bom ? "\uFEFF" : "") + out], { type: "application/json" }));
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  setStatus("Saved.");
}

function loadText(txt, name) {
  try {
    const bom = txt.charCodeAt(0) === 0xfeff;
    const body = bom ? txt.slice(1) : txt;
    const data = JSON.parse(body);
    const m = body.match(/^\s*[{[]\r?\n([ \t]+)/);
    fmt = { indent: m ? m[1] : 0, crlf: body.includes("\r\n"), bom };
    S = data;
    fileName = name;
    normalizeData();
    renderAll();
    setStatus(`Loaded: ${name}`);
  } catch (err) {
    setStatus("Invalid JSON (encrypted/compressed ES3 not supported): " + err.message, false);
  }
}

const ACTIONS = {
  open: () => $("fileInput").click(),
  reset: () => location.reload(),
  save: doSave,
  maxGame: autoMaxGame,
  max: (d) => autoMax(d.arg),
  addRetainer, addHorse, addAllItems, addItem,
  del: deleteRow,
};
const NO_SAVE_OK = new Set(["open", "reset"]);

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-a]");
  if (!b) return;
  const a = b.dataset.a;
  if (!S && !NO_SAVE_OK.has(a)) return setStatus("No save loaded", false);
  ACTIONS[a]?.(b.dataset);
});

document.addEventListener("change", (e) => {
  const { t, i, f } = e.target.dataset;
  if (!t || !f || !S) return;
  if (t === "game") {
    e.target.value = gameSet(f, e.target.value);
    return;
  }
  const row = S[KEY[t]]?.value[+i];
  if (row) e.target.value = setField(t, row, f, e.target.value);
});

$("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  file.text().then((txt) => loadText(txt, file.name));
  e.target.value = "";
});
