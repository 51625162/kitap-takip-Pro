/* ============================= VERİ MODELİ ============================= */
function daysAgoISO(n){
  const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10);
}
function seedHistory(historyArr, kod, guncel, dunku, hafta, yil, ucYil){
  historyArr.push(
    {kod, tarih: daysAgoISO(1095), fiyat: ucYil},
    {kod, tarih: daysAgoISO(365), fiyat: yil},
    {kod, tarih: daysAgoISO(7), fiyat: hafta},
    {kod, tarih: daysAgoISO(1), fiyat: dunku},
    {kod, tarih: daysAgoISO(0), fiyat: guncel},
  );
}

const PORTFOLIOS = {
  bist: {
    label:"BIST Portföy", currency:"TL", accent:"#d9a441", idLabel:"Hisse Kodu",
    rows:[
      {id:1, kod:"ASELS", adet:500, alis:62.50, alisTarihi:"2025-03-10", guncel:68.90},
      {id:2, kod:"THYAO", adet:200, alis:275.00, alisTarihi:"2025-06-02", guncel:298.50},
      {id:3, kod:"OTOKAR", adet:50, alis:1450.00, alisTarihi:"2024-11-20", guncel:1620.00},
      {id:4, kod:"LOGO", adet:300, alis:38.20, alisTarihi:"2025-01-15", guncel:41.10},
      {id:5, kod:"PGSUS", adet:100, alis:410.00, alisTarihi:"2025-05-05", guncel:455.00},
    ],
    history:[],
  },
  abd: {
    label:"ABD Portföy", currency:"$", accent:"#4f8fd1", idLabel:"Hisse Kodu",
    rows:[
      {id:1, kod:"AAPL", adet:20, alis:175.00, alisTarihi:"2025-02-10", guncel:214.50},
      {id:2, kod:"MSFT", adet:15, alis:340.00, alisTarihi:"2025-04-05", guncel:415.00},
      {id:3, kod:"NVDA", adet:30, alis:480.00, alisTarihi:"2025-01-20", guncel:890.00},
      {id:4, kod:"TSLA", adet:10, alis:210.00, alisTarihi:"2025-06-12", guncel:245.00},
      {id:5, kod:"AMZN", adet:12, alis:145.00, alisTarihi:"2025-03-18", guncel:188.00},
    ],
    history:[],
  },
  fon: {
    label:"Fon Portföy", currency:"TL", accent:"#3fb6a8", idLabel:"Fon Kodu",
    rows:[
      {id:1, kod:"AFT", adet:1500, alis:1.85, alisTarihi:"2025-02-20", guncel:2.10},
      {id:2, kod:"TTE", adet:800, alis:3.40, alisTarihi:"2025-05-15", guncel:3.72},
      {id:3, kod:"GPB", adet:2000, alis:0.92, alisTarihi:"2025-01-08", guncel:1.05},
      {id:4, kod:"IPJ", adet:600, alis:5.10, alisTarihi:"2025-06-25", guncel:5.55},
      {id:5, kod:"MAC", adet:1200, alis:2.30, alisTarihi:"2025-03-30", guncel:2.48},
    ],
    history:[],
  },
  kripto: {
    label:"Kripto Portföy", currency:"$", accent:"#e0954f", idLabel:"Kripto Kodu",
    rows:[
      {id:1, kod:"BTC", adet:0.25, alis:52000.00, alisTarihi:"2025-02-05", guncel:68500.00},
      {id:2, kod:"ETH", adet:3.5, alis:2800.00, alisTarihi:"2025-04-12", guncel:3450.00},
      {id:3, kod:"SOL", adet:40, alis:110.00, alisTarihi:"2025-05-20", guncel:158.00},
      {id:4, kod:"XRP", adet:2000, alis:0.55, alisTarihi:"2025-03-08", guncel:0.72},
      {id:5, kod:"BNB", adet:8, alis:410.00, alisTarihi:"2025-06-01", guncel:520.00},
    ],
    history:[],
  },
};

seedHistory(PORTFOLIOS.kripto.history, "BTC", 68500.00, 67800.00, 65200.00, 42000.00, 18500.00);
seedHistory(PORTFOLIOS.kripto.history, "ETH", 3450.00, 3400.00, 3200.00, 2200.00, 1200.00);
seedHistory(PORTFOLIOS.kripto.history, "SOL", 158.00, 155.00, 145.00, 85.00, 22.00);
seedHistory(PORTFOLIOS.kripto.history, "XRP", 0.72, 0.71, 0.66, 0.48, 0.32);
seedHistory(PORTFOLIOS.kripto.history, "BNB", 520.00, 515.00, 495.00, 340.00, 210.00);

seedHistory(PORTFOLIOS.bist.history, "ASELS", 68.90, 68.20, 66.10, 45.30, 22.10);
seedHistory(PORTFOLIOS.bist.history, "THYAO", 298.50, 301.00, 290.00, 260.00, 130.00);
seedHistory(PORTFOLIOS.bist.history, "OTOKAR", 1620.00, 1600.00, 1580.00, 1100.00, 650.00);
seedHistory(PORTFOLIOS.bist.history, "LOGO", 41.10, 40.80, 39.50, 30.00, 18.50);
seedHistory(PORTFOLIOS.bist.history, "PGSUS", 455.00, 450.00, 430.00, 350.00, 210.00);

seedHistory(PORTFOLIOS.abd.history, "AAPL", 214.50, 213.00, 208.00, 180.00, 130.00);
seedHistory(PORTFOLIOS.abd.history, "MSFT", 415.00, 412.50, 400.00, 340.00, 250.00);
seedHistory(PORTFOLIOS.abd.history, "NVDA", 890.00, 875.00, 820.00, 480.00, 140.00);
seedHistory(PORTFOLIOS.abd.history, "TSLA", 245.00, 250.00, 230.00, 180.00, 220.00);
seedHistory(PORTFOLIOS.abd.history, "AMZN", 188.00, 186.00, 178.00, 150.00, 95.00);

seedHistory(PORTFOLIOS.fon.history, "AFT", 2.10, 2.08, 2.02, 1.55, 0.95);
seedHistory(PORTFOLIOS.fon.history, "TTE", 3.72, 3.70, 3.60, 2.90, 1.80);
seedHistory(PORTFOLIOS.fon.history, "GPB", 1.05, 1.04, 1.00, 0.78, 0.48);
seedHistory(PORTFOLIOS.fon.history, "IPJ", 5.55, 5.50, 5.35, 4.20, 2.60);
seedHistory(PORTFOLIOS.fon.history, "MAC", 2.48, 2.46, 2.38, 1.95, 1.20);

let nextId = {bist:6, abd:6, fon:6, kripto:6};
let usdTry = 34.50; // kullanıcı güncelleyebilir

const TAB_ORDER = ["bist","abd","fon","kripto","overview","macro"];
let activeTab = "bist";
let editingId = {bist:null, abd:null, fon:null, kripto:null};
let searchTerm = {bist:"", abd:"", fon:"", kripto:""};
let sortState = {bist:{col:null,dir:1}, abd:{col:null,dir:1}, fon:{col:null,dir:1}, kripto:{col:null,dir:1}};
let historyEditor = null; // {key, rowId} açık olan fiyat geçmişi paneli

/* ---------- Makroekonomik Veriler (bağımsız bölüm) ---------- */
let macroNextId = 1;
function mi(isim){ return {id: macroNextId++, isim, incelendi:false, tarih:null}; }
const MACRO = {
  categories: [
    {key:"reel", label:"Reel Göstergeler", items:[
      mi("Gayri Safi Yurtiçi Hasıla"), mi("İstihdam/İşsizlik Oranları"), mi("Elektrik Tüketimi"),
      mi("Kapasite Kullanımı"), mi("Sanayi Üretim Endeksi"), mi("Perakende Satışlar/Tüketici Fiyatları"), mi("Tarımsal Üretim"),
    ]},
    {key:"mali", label:"Mali Göstergeler", items:[
      mi("ÜFE/TÜFE/Enflasyon"), mi("Faiz"), mi("Döviz Kurları"), mi("Bütçe Açığı"), mi("Kredilerdeki Değişim"),
      mi("Borsa Endeksi"), mi("Para Arzı"), mi("Cari İşlemler Açığı"), mi("İç/Dış Borç Stoku"),
      mi("Turizm Gelirleri"), mi("İthalat/İhracat Rakamları"),
    ]},
    {key:"diger", label:"Diğer Göstergeler", items:[
      mi("Derecelendirme Kuruluş Notu"), mi("IMF ve Dünya Bankası Raporları"),
      mi("Avrupa Birliği Ekonomik Raporları"), mi("Politik Risk"), mi("Seçim Dönemleri"),
    ]},
    {key:"oncu", label:"Öncü Göstergeler", items:[
      mi("Borsa Endeksleri"), mi("Yeni İşyerlerinin Açılması"), mi("İnşaat Ruhsatları"),
      mi("Stoklardaki Değişim"), mi("Sanayide İşe Çıkarma Oranları"), mi("Satınalma Performansı"),
    ]},
    {key:"destek", label:"Destekleyici Göstergeler", items:[
      mi("Sanayi Üretim Endeksleri"), mi("Sanayi ve Ticari Satışlar"), mi("Tarım Dışı İstihdam"),
    ]},
    {key:"gecikmeli", label:"Gecikmeli Göstergeler", items:[
      mi("Sanayi ve Ticaret Stokları"), mi("Birim İşgücü Maliyetlerindeki Değişim"),
      mi("Banka Faiz Oranları Değişimi"), mi("Tüketici Borç/Gelir Oranı"), mi("Ticari ve Sanayi Borçlarındaki Değişim"),
    ]},
  ],
};

/* ============================= KALICI SAKLAMA (localStorage) ============================= */
const STORAGE_KEY = "portfoyTakipData_v1";
let storageAvailable = true;

function buildPayload(){
  return {
    usdTry,
    nextId,
    rows: { bist:PORTFOLIOS.bist.rows, abd:PORTFOLIOS.abd.rows, fon:PORTFOLIOS.fon.rows, kripto:PORTFOLIOS.kripto.rows },
    history: { bist:PORTFOLIOS.bist.history, abd:PORTFOLIOS.abd.history, fon:PORTFOLIOS.fon.history, kripto:PORTFOLIOS.kripto.history },
    macro: MACRO.categories,
    macroNextId,
  };
}

function applyPayload(payload){
  if(!payload) return false;
  if(payload.usdTry) usdTry = payload.usdTry;
  if(payload.nextId) nextId = payload.nextId;
  if(payload.rows){
    ["bist","abd","fon","kripto"].forEach(k => { if(Array.isArray(payload.rows[k])) PORTFOLIOS[k].rows = payload.rows[k]; });
  }
  if(payload.history){
    ["bist","abd","fon","kripto"].forEach(k => { if(Array.isArray(payload.history[k])) PORTFOLIOS[k].history = payload.history[k]; });
  }
  if(Array.isArray(payload.macro)) MACRO.categories = payload.macro;
  if(payload.macroNextId) macroNextId = payload.macroNextId;
  return true;
}

function saveState(){
  if(storageAvailable){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(buildPayload())); }
    catch(e){ storageAvailable = false; }
  }
  pushToCloud();
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) applyPayload(JSON.parse(raw));
  } catch(e){ storageAvailable = false; }
}

function resetToSamples(){
  if(!confirm("Tüm veriler örnek başlangıç verilerine döndürülecek. Emin misiniz?")) return;
  try{ localStorage.removeItem(STORAGE_KEY); } catch(e){}
  location.reload();
}

/* ---------- JSON dosyasıyla dışa / içe aktarma ---------- */
function exportAllData(){
  const payload = buildPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const tarih = new Date().toISOString().slice(0,10);
  a.href = url; a.download = `portfoy_yedek_${tarih}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importAllData(file){
  const reader = new FileReader();
  reader.onload = (e) => {
    try{
      const payload = JSON.parse(e.target.result);
      if(!payload || !payload.rows) throw new Error("geçersiz dosya");
      applyPayload(payload);
      saveState();
      renderMain();
      alert("Veriler başarıyla içe aktarıldı.");
    } catch(err){
      alert("Dosya okunamadı — geçerli bir portföy yedek dosyası (.json) seçtiğinizden emin olun.");
    }
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("importFile");
  if(fileInput){
    fileInput.addEventListener("change", (e) => {
      if(e.target.files && e.target.files[0]) importAllData(e.target.files[0]);
      e.target.value = "";
    });
  }
});

/* ============================= BULUT SENKRON (JSONBin.io) ============================= */
const CLOUD_CONFIG_KEY = "portfoyCloudConfig_v1";
let cloudSyncing = false;
let cloudLastSync = null;

function getCloudConfig(){
  try{
    const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e){ return null; }
}
function setCloudConfig(cfg){
  try{ localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cfg)); } catch(e){}
}
function clearCloudConfig(){
  try{ localStorage.removeItem(CLOUD_CONFIG_KEY); } catch(e){}
}

async function jsonbinRequest(url, options){
  const res = await fetch(url, options);
  if(!res.ok) throw new Error("JSONBin isteği başarısız: " + res.status);
  return res.json();
}

async function createCloudBin(apiKey){
  const data = await jsonbinRequest("https://api.jsonbin.io/v3/b", {
    method:"POST",
    headers:{ "Content-Type":"application/json", "X-Master-Key":apiKey, "X-Bin-Private":"true", "X-Bin-Name":"Portfoy Takip" },
    body: JSON.stringify(buildPayload()),
  });
  return data.metadata.id;
}

async function pushToCloud(){
  const cfg = getCloudConfig();
  if(!cfg || !cfg.apiKey || !cfg.binId) return;
  cloudSyncing = true; updateCloudStatus();
  try{
    await jsonbinRequest(`https://api.jsonbin.io/v3/b/${cfg.binId}`, {
      method:"PUT",
      headers:{ "Content-Type":"application/json", "X-Master-Key":cfg.apiKey },
      body: JSON.stringify(buildPayload()),
    });
    cloudLastSync = new Date();
  } catch(e){ console.warn("Buluta kaydedilemedi:", e.message); }
  cloudSyncing = false; updateCloudStatus();
}

async function pullFromCloud(silent){
  const cfg = getCloudConfig();
  if(!cfg || !cfg.apiKey || !cfg.binId) return false;
  cloudSyncing = true; updateCloudStatus();
  try{
    const data = await jsonbinRequest(`https://api.jsonbin.io/v3/b/${cfg.binId}/latest`, {
      headers:{ "X-Master-Key":cfg.apiKey },
    });
    applyPayload(data.record);
    cloudLastSync = new Date();
    cloudSyncing = false; updateCloudStatus();
    return true;
  } catch(e){
    cloudSyncing = false; updateCloudStatus();
    if(!silent) alert("Buluttan veri çekilemedi — API anahtarı/Bin ID doğru mu, internet bağlantınız var mı kontrol edin.");
    return false;
  }
}

function updateCloudStatus(){
  const el = document.getElementById("cloudStatus");
  if(!el) return;
  const cfg = getCloudConfig();
  if(!cfg || !cfg.apiKey || !cfg.binId){ el.textContent = "Bulut senkron kapalı"; return; }
  if(cloudSyncing){ el.textContent = "Senkronize ediliyor…"; return; }
  el.textContent = cloudLastSync ? `Son senkron: ${cloudLastSync.toLocaleTimeString("tr-TR")}` : "Bağlı — henüz senkron olmadı";
}

function toggleCloudPanel(){
  const el = document.getElementById("cloudPanel");
  el.style.display = el.style.display === "none" ? "block" : "none";
  if(el.style.display === "block") renderCloudPanel();
}

function renderCloudPanel(){
  const el = document.getElementById("cloudPanel");
  const cfg = getCloudConfig() || {apiKey:"", binId:""};
  el.innerHTML = `
    <div class="drawer open" style="max-width:520px;">
      <h3>☁ Bulut Senkron Ayarları (JSONBin.io)</h3>
      <p style="font-size:12.5px; color:var(--text-soft); margin-top:-6px;">
        jsonbin.io adresinden ücretsiz hesap açıp "X-Master-Key" alın. Aynı API Key ve Bin ID'yi tüm cihazlarınıza girerseniz
        veriler otomatik senkronize olur.
      </p>
      <div class="field-grid">
        <div class="field"><label>API Key (X-Master-Key)</label><input id="cfgApiKey" type="text" value="${cfg.apiKey||""}"></div>
        <div class="field"><label>Bin ID (varsa)</label><input id="cfgBinId" type="text" value="${cfg.binId||""}"></div>
      </div>
      <div class="drawer-actions" style="flex-wrap:wrap;">
        <button class="btn btn-accent" id="btnCreateBin">Yeni Bin Oluştur</button>
        <button class="btn" id="btnConnect">Kaydet ve Buluttan Yükle</button>
        <button class="btn" id="btnPushNow">Şimdi Buluta Gönder</button>
        <button class="btn btn-danger" id="btnDisconnect">Bağlantıyı Kaldır</button>
      </div>
      <div id="cloudStatus" style="margin-top:10px; font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--text-soft);"></div>
    </div>
  `;
  updateCloudStatus();

  document.getElementById("btnCreateBin").onclick = async () => {
    const apiKey = document.getElementById("cfgApiKey").value.trim();
    if(!apiKey){ alert("Önce API Key girin."); return; }
    try{
      const binId = await createCloudBin(apiKey);
      setCloudConfig({apiKey, binId});
      alert("Yeni bin oluşturuldu. Bin ID: " + binId + "\nBu ID'yi diğer cihazlarınıza da girin.");
      renderCloudPanel();
    } catch(e){ alert("Bin oluşturulamadı: " + e.message); }
  };
  document.getElementById("btnConnect").onclick = async () => {
    const apiKey = document.getElementById("cfgApiKey").value.trim();
    const binId = document.getElementById("cfgBinId").value.trim();
    if(!apiKey || !binId){ alert("API Key ve Bin ID girin."); return; }
    setCloudConfig({apiKey, binId});
    const ok = await pullFromCloud();
    if(ok){ renderMain(); renderCloudPanel(); }
  };
  document.getElementById("btnPushNow").onclick = () => pushToCloud();
  document.getElementById("btnDisconnect").onclick = () => {
    if(!confirm("Bulut bağlantısı kaldırılsın mı? (Bulutdaki veri silinmez, sadece bu cihazın bağlantısı kesilir.)")) return;
    clearCloudConfig();
    renderCloudPanel();
  };
}

/* ============================= HESAPLAMALAR ============================= */
function lookupHistoricalPrice(history, kod, daysAgo){
  const target = new Date();
  target.setHours(0,0,0,0);
  target.setDate(target.getDate()-daysAgo);
  let best = null, bestDate = null;
  history.forEach(h => {
    if(h.kod !== kod) return;
    const d = new Date(h.tarih);
    d.setHours(0,0,0,0);
    if(d.getTime() <= target.getTime() && (!bestDate || d.getTime() > bestDate.getTime())){
      best = h.fiyat; bestDate = d;
    }
  });
  return best;
}
function pctChange(current, past){
  if(past===null||past===undefined||past===0||current===null||current===undefined||isNaN(current)) return null;
  return (current-past)/past;
}
function computed(row, key){
  const history = PORTFOLIOS[key].history || [];
  const dunku = lookupHistoricalPrice(history, row.kod, 1);
  const hafta = lookupHistoricalPrice(history, row.kod, 7);
  const yil = lookupHistoricalPrice(history, row.kod, 365);
  const ucYil = lookupHistoricalPrice(history, row.kod, 1095);
  const gunluk = pctChange(row.guncel, dunku);
  const haftalik = pctChange(row.guncel, hafta);
  const yillik = pctChange(row.guncel, yil);
  const ucYillik = pctChange(row.guncel, ucYil);
  const maliyet = row.adet*row.alis;
  const guncelDeger = row.adet*row.guncel;
  const karZarar = guncelDeger-maliyet;
  const karZararPct = safeDiv(karZarar, maliyet);
  return {gunluk,haftalik,yillik,ucYillik,maliyet,guncelDeger,karZarar,karZararPct};
}
function safeDiv(a,b){ return b ? a/b : null; }

function portfolioTotals(key){
  const p = PORTFOLIOS[key];
  let maliyet=0, guncelDeger=0;
  p.rows.forEach(r => { const c = computed(r,key); maliyet+=c.maliyet; guncelDeger+=c.guncelDeger; });
  const karZarar = guncelDeger-maliyet;
  const karZararPct = safeDiv(karZarar, maliyet);
  return {maliyet, guncelDeger, karZarar, karZararPct};
}

/* ============================= FORMAT ============================= */
function fmtMoney(val, cur){
  if(val===null||val===undefined||isNaN(val)) return "—";
  const sign = val>0?"+":val<0?"-":"";
  return `${sign}${Math.abs(val).toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})} ${cur}`;
}
function fmtMoneyPlain(val, cur){
  if(val===null||val===undefined||isNaN(val)) return "—";
  return `${val.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})} ${cur}`;
}
function fmtPct(val){
  if(val===null||val===undefined||isNaN(val)) return "—";
  const sign = val>0?"+":val<0?"-":"";
  return `${sign}${Math.abs(val*100).toFixed(1)}%`;
}
function pctClass(val){ if(val===null||val===undefined||isNaN(val)) return ""; return val>0?"pos":val<0?"neg":""; }

/* ============================= TICKER ============================= */
function renderTicker(){
  const el = document.getElementById("tickerTape");
  let items = [];
  Object.entries(PORTFOLIOS).forEach(([key,p]) => {
    p.rows.forEach(r => {
      const c = computed(r,key);
      items.push(`<span class="tick-item ${pctClass(c.gunluk)==='pos'?'up':pctClass(c.gunluk)==='neg'?'down':''}"><b>${r.kod}</b>${fmtPct(c.gunluk)}</span>`);
    });
  });
  el.innerHTML = items.join("") + items.join(""); // duplicate for seamless loop
  const bugun = new Date().toLocaleDateString("tr-TR", {day:"2-digit", month:"long", year:"numeric", weekday:"long"});
  document.getElementById("headerMeta").innerHTML = `${bugun}<br>Toplam ${Object.values(PORTFOLIOS).reduce((s,p)=>s+p.rows.length,0)} kayıt · USD/TRY: ${usdTry.toFixed(2)}`;
}

/* ============================= TABS ============================= */
function renderTabs(){
  const nav = document.getElementById("tabs");
  nav.innerHTML = "";
  const labels = {bist:"BIST Portföy", abd:"ABD Portföy", fon:"Fon Portföy", kripto:"Kripto Portföy", overview:"Genel Bakış", macro:"Makroekonomik Veriler"};
  TAB_ORDER.forEach(key => {
    const btn = document.createElement("button");
    btn.textContent = labels[key];
    btn.className = key===activeTab?"active":"";
    btn.style.setProperty("--accent", getTabAccent(key));
    btn.onclick = () => { activeTab = key; renderMain(); };
    nav.appendChild(btn);
  });
}
function getTabAccent(key){
  if(key==="overview") return "#e7ebee";
  if(key==="macro") return "#c2703a";
  return PORTFOLIOS[key].accent;
}

/* ============================= MAIN RENDER ============================= */
function renderMain(){
  renderTabs();
  const main = document.getElementById("main");
  main.innerHTML = "";
  if(activeTab === "overview"){ main.appendChild(renderOverview()); }
  else if(activeTab === "macro"){ main.appendChild(renderMacroPanel()); }
  else { main.appendChild(renderPortfolioPanel(activeTab)); }
  renderTicker();
}

/* ============================= PORTFOLIO PANEL ============================= */
function renderPortfolioPanel(key){
  const p = PORTFOLIOS[key];
  const totals = portfolioTotals(key);
  const panel = document.createElement("div");
  panel.className = "panel active";
  panel.style.setProperty("--accent", p.accent);

  // ---- summary cards ----
  const cards = document.createElement("div");
  cards.className = "cards";
  cards.innerHTML = `
    <div class="card"><div class="label">Toplam Maliyet</div><div class="value">${fmtMoneyPlain(totals.maliyet,p.currency)}</div></div>
    <div class="card"><div class="label">Güncel Değer</div><div class="value">${fmtMoneyPlain(totals.guncelDeger,p.currency)}</div></div>
    <div class="card"><div class="label">Kar / Zarar</div><div class="value ${pctClass(totals.karZarar)}">${fmtMoney(totals.karZarar,p.currency)}</div><div class="sub ${pctClass(totals.karZararPct)}">${fmtPct(totals.karZararPct)}</div></div>
    <div class="card"><div class="label">Kayıt Sayısı</div><div class="value">${p.rows.length}</div><div class="sub">${p.idLabel}</div></div>
  `;
  panel.appendChild(cards);

  // ---- toolbar ----
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  const left = document.createElement("div");
  left.className = "toolbar-left";
  const search = document.createElement("input");
  search.className="search"; search.placeholder="Kod ara…"; search.value = searchTerm[key];
  search.oninput = e => { searchTerm[key]=e.target.value; renderMain(); };
  const exportBtn = document.createElement("button");
  exportBtn.className="btn"; exportBtn.textContent="⭳ CSV indir";
  exportBtn.onclick = () => exportCSV(key);
  const clearHistBtn = document.createElement("button");
  clearHistBtn.className="btn"; clearHistBtn.textContent="🧹 Fiyat Geçmişini Sıfırla";
  clearHistBtn.title = "Yanlış/eski görünen değişim yüzdelerini düzeltmek için bu portföydeki TÜM hisselerin fiyat geçmişini temizler";
  clearHistBtn.onclick = () => {
    if(!confirm("Bu portföydeki TÜM hisselerin fiyat geçmişi silinecek (Günlük/Haftalık/Yıllık/3 Yıllık % değerleri sıfırlanacak). Silinen/yeniden eklenen hisselerde görülen yanlış yüzdeleri düzeltmek için kullanılır. Emin misiniz?")) return;
    PORTFOLIOS[key].history = [];
    saveState();
    renderMain();
  };
  left.appendChild(search); left.appendChild(exportBtn); left.appendChild(clearHistBtn);
  const addBtn = document.createElement("button");
  addBtn.className="btn btn-accent"; addBtn.textContent="+ Yeni "+ (key==="fon"?"Fon":key==="kripto"?"Kripto":"Hisse");
  addBtn.onclick = () => { editingId[key]="new"; renderMain(); };
  toolbar.appendChild(left); toolbar.appendChild(addBtn);
  panel.appendChild(toolbar);

  // ---- table ----
  panel.appendChild(renderTable(key));

  // ---- drawer ----
  if(editingId[key]!==null){ panel.appendChild(renderDrawer(key, editingId[key])); }
  if(historyEditor && historyEditor.key===key){ panel.appendChild(renderHistoryDrawer(key, historyEditor.rowId)); }

  // ---- charts ----
  panel.appendChild(renderChartsSection(key));

  return panel;
}

const COLS = [
  {key:"kod", label:"Kod"}, {key:"adet", label:"Adet"}, {key:"alis", label:"Alış Fiy."},
  {key:"alisTarihi", label:"Alış Tar."}, {key:"guncel", label:"Güncel Fiy."},
  {key:"gunluk", label:"Günlük %", derived:true}, {key:"haftalik", label:"Haftalık %", derived:true},
  {key:"yillik", label:"Yıllık %", derived:true}, {key:"ucYillik", label:"3 Yıllık %", derived:true},
  {key:"maliyet", label:"Maliyet", derived:true}, {key:"guncelDeger", label:"Güncel Değer", derived:true},
  {key:"karZarar", label:"Kar/Zarar", derived:true}, {key:"karZararPct", label:"Kar/Zarar %", derived:true},
];

function renderTable(key){
  const p = PORTFOLIOS[key];
  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  COLS.forEach(c => {
    const th = document.createElement("th");
    th.textContent = c.label;
    if(sortState[key].col===c.key){ th.classList.add("sorted"); if(sortState[key].dir===-1) th.classList.add("asc"); }
    th.onclick = () => { toggleSort(key,c.key); };
    trh.appendChild(th);
  });
  const thAct = document.createElement("th"); thAct.textContent="İşlem"; thAct.style.cursor="default";
  trh.appendChild(thAct);
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  let enriched = p.rows.map(r => ({row:r, c: computed(r,key)}));
  // best/worst by günlük %
  let bestId=null, worstId=null;
  if(enriched.length){
    const withVal = enriched.filter(e=>e.c.gunluk!==null);
    if(withVal.length){
      bestId = withVal.reduce((a,b)=>b.c.gunluk>a.c.gunluk?b:a).row.id;
      worstId = withVal.reduce((a,b)=>b.c.gunluk<a.c.gunluk?b:a).row.id;
    }
  }
  // filter
  const term = searchTerm[key].toLocaleLowerCase("tr");
  if(term) enriched = enriched.filter(e => e.row.kod.toLocaleLowerCase("tr").includes(term));
  // sort
  const {col,dir} = sortState[key];
  if(col){
    enriched.sort((a,b) => {
      const va = col in a.row ? a.row[col] : a.c[col];
      const vb = col in b.row ? b.row[col] : b.c[col];
      if(typeof va === "string") return va.localeCompare(vb,"tr")*dir;
      return ((va??-Infinity)-(vb??-Infinity))*dir;
    });
  }

  if(enriched.length===0){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${COLS.length+1}">Kayıt bulunamadı.</td></tr>`;
  } else {
    enriched.forEach(({row,c}) => {
      const tr = document.createElement("tr");
      let badge = "";
      if(row.id===bestId && enriched.length>1) badge = `<span class="badge badge-best">En iyi</span>`;
      if(row.id===worstId && enriched.length>1 && worstId!==bestId) badge = `<span class="badge badge-worst">En kötü</span>`;
      tr.innerHTML = `
        <td><span class="kod-pill">${row.kod}</span>${badge}</td>
        <td>${row.adet.toLocaleString("tr-TR")}</td>
        <td>${fmtMoneyPlain(row.alis,p.currency)}</td>
        <td>${row.alisTarihi}</td>
        <td>${fmtMoneyPlain(row.guncel,p.currency)}</td>
        <td class="${pctClass(c.gunluk)}">${fmtPct(c.gunluk)}</td>
        <td class="${pctClass(c.haftalik)}">${fmtPct(c.haftalik)}</td>
        <td class="${pctClass(c.yillik)}">${fmtPct(c.yillik)}</td>
        <td class="${pctClass(c.ucYillik)}">${fmtPct(c.ucYillik)}</td>
        <td>${fmtMoneyPlain(c.maliyet,p.currency)}</td>
        <td>${fmtMoneyPlain(c.guncelDeger,p.currency)}</td>
        <td class="${pctClass(c.karZarar)}">${fmtMoney(c.karZarar,p.currency)}</td>
        <td class="${pctClass(c.karZararPct)}">${fmtPct(c.karZararPct)}</td>
        <td class="row-actions">
          <button class="btn btn-sm" data-act="hist" data-id="${row.id}">Geçmiş</button>
          <button class="btn btn-sm" data-act="edit" data-id="${row.id}">Düzenle</button>
          <button class="btn btn-sm btn-danger" data-act="del" data-id="${row.id}">Sil</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }
  table.appendChild(tbody);
  wrap.appendChild(table);

  wrap.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      if(btn.dataset.act==="edit"){ editingId[key]=id; renderMain(); }
      if(btn.dataset.act==="del"){ deleteRow(key,id); }
      if(btn.dataset.act==="hist"){ historyEditor = {key, rowId:id}; renderMain(); }
    });
  });
  return wrap;
}

function toggleSort(key,col){
  const s = sortState[key];
  if(s.col===col) s.dir *= -1; else { s.col=col; s.dir=1; }
  renderMain();
}

/* ============================= DRAWER ============================= */
const FORM_FIELDS = [
  {key:"kod", label:"Kod", type:"text"},
  {key:"adet", label:"Adet", type:"number"},
  {key:"alis", label:"Alış Fiyatı", type:"number"},
  {key:"alisTarihi", label:"Alış Tarihi", type:"date"},
  {key:"guncel", label:"Güncel Fiyat", type:"number"},
];

function renderDrawer(key, id){
  const p = PORTFOLIOS[key];
  const isNew = id==="new";
  const row = isNew ? {} : p.rows.find(r=>r.id===id);
  const drawer = document.createElement("div");
  drawer.className = "drawer open";
  drawer.style.setProperty("--accent", p.accent);
  drawer.innerHTML = `<h3>${isNew?"Yeni Kayıt":"Kaydı Düzenle"} — ${p.label}</h3>`;

  const grid = document.createElement("div");
  grid.className = "field-grid";
  FORM_FIELDS.forEach(f => {
    const field = document.createElement("div");
    field.className="field";
    const label = document.createElement("label"); label.textContent=f.label;
    const input = document.createElement("input");
    input.type = f.type; input.step="any"; input.dataset.field=f.key;
    input.value = row[f.key] ?? "";
    field.appendChild(label); field.appendChild(input);
    grid.appendChild(field);
  });
  drawer.appendChild(grid);

  const actions = document.createElement("div");
  actions.className="drawer-actions";
  const saveBtn = document.createElement("button");
  saveBtn.className="btn btn-accent"; saveBtn.textContent = isNew?"Kaydet":"Güncelle";
  saveBtn.onclick = () => saveRow(key, isNew?null:id, grid);
  const cancelBtn = document.createElement("button");
  cancelBtn.className="btn"; cancelBtn.textContent="Vazgeç";
  cancelBtn.onclick = () => { editingId[key]=null; renderMain(); };
  actions.appendChild(saveBtn); actions.appendChild(cancelBtn);
  drawer.appendChild(actions);
  return drawer;
}

/* ---------- Fiyat Geçmişi paneli (değişim %'lerinin dayandığı kayıtlar) ---------- */
function renderHistoryDrawer(key, rowId){
  const p = PORTFOLIOS[key];
  const row = p.rows.find(r=>r.id===rowId);
  const drawer = document.createElement("div");
  drawer.className = "drawer open";
  drawer.style.setProperty("--accent", p.accent);

  if(!row){
    drawer.innerHTML = `<h3>Kayıt bulunamadı</h3>`;
    return drawer;
  }

  const entries = p.history.filter(h=>h.kod===row.kod).sort((a,b)=> b.tarih.localeCompare(a.tarih));

  drawer.innerHTML = `
    <h3>📅 ${row.kod} — Fiyat Geçmişi</h3>
    <p style="font-size:12.5px; color:var(--text-soft); margin-top:-6px;">
      Günlük/Haftalık/Yıllık/3 Yıllık değişim yüzdeleri, buraya eklediğiniz geçmiş tarihli fiyatlara göre otomatik hesaplanır.
      Örn. günlük değişim için dünün tarihli bir fiyat kaydı yeterlidir.
    </p>
    <div class="field-grid" style="grid-template-columns:1fr 1fr auto auto;">
      <div class="field"><label>Tarih</label><input type="date" id="histTarih"></div>
      <div class="field"><label>Fiyat</label><input type="number" step="any" id="histFiyat"></div>
      <div class="field" style="align-self:flex-end;"><button class="btn btn-accent" id="btnAddHist">Ekle</button></div>
      <div class="field" style="align-self:flex-end;"><button class="btn" id="btnTodayHist">Bugünü Kaydet</button></div>
    </div>
    <div class="table-wrap" style="margin-top:16px;">
      <table>
        <thead><tr><th>Tarih</th><th>Fiyat</th><th>İşlem</th></tr></thead>
        <tbody>
          ${entries.length ? entries.map(h => `
            <tr>
              <td style="text-align:left;">${h.tarih}</td>
              <td>${fmtMoneyPlain(h.fiyat, p.currency)}</td>
              <td class="row-actions"><button class="btn btn-sm btn-danger" data-tarih="${h.tarih}">Sil</button></td>
            </tr>`).join("") : `<tr class="empty-row"><td colspan="3">Henüz geçmiş kaydı yok.</td></tr>`}
        </tbody>
      </table>
    </div>
    <div class="drawer-actions">
      <button class="btn" id="btnCloseHist">Kapat</button>
      <button class="btn btn-danger" id="btnClearHist">Tüm Geçmişi Temizle</button>
    </div>
  `;

  drawer.querySelector("#btnAddHist").onclick = () => {
    const tarih = drawer.querySelector("#histTarih").value;
    const fiyat = Number(drawer.querySelector("#histFiyat").value);
    if(!tarih || !fiyat){ alert("Tarih ve fiyat girin."); return; }
    addHistoryEntry(key, row.kod, tarih, fiyat);
    saveState();
    renderMain();
  };
  drawer.querySelector("#btnTodayHist").onclick = () => {
    const today = new Date().toISOString().slice(0,10);
    addHistoryEntry(key, row.kod, today, row.guncel);
    saveState();
    renderMain();
  };
  drawer.querySelector("#btnCloseHist").onclick = () => { historyEditor = null; renderMain(); };
  drawer.querySelector("#btnClearHist").onclick = () => {
    if(!confirm(`${row.kod} için kayıtlı tüm fiyat geçmişi silinecek (yanlış/eski kayıtları temizlemek için). Emin misiniz?`)) return;
    PORTFOLIOS[key].history = PORTFOLIOS[key].history.filter(h=>h.kod!==row.kod);
    saveState();
    renderMain();
  };
  drawer.querySelectorAll("button[data-tarih]").forEach(btn => {
    btn.onclick = () => {
      deleteHistoryEntry(key, row.kod, btn.dataset.tarih);
      saveState();
      renderMain();
    };
  });

  return drawer;
}

function addHistoryEntry(key, kod, tarih, fiyat){
  const history = PORTFOLIOS[key].history;
  const idx = history.findIndex(h=>h.kod===kod && h.tarih===tarih);
  if(idx>=0) history[idx].fiyat = fiyat;
  else history.push({kod, tarih, fiyat});
}
function deleteHistoryEntry(key, kod, tarih){
  PORTFOLIOS[key].history = PORTFOLIOS[key].history.filter(h=>!(h.kod===kod && h.tarih===tarih));
}

function saveRow(key, id, grid){
  const p = PORTFOLIOS[key];
  const inputs = grid.querySelectorAll("[data-field]");
  const data = {};
  let valid = true;
  inputs.forEach(inp => {
    let val = inp.value;
    if(!val){ inp.style.borderColor="var(--red)"; valid=false; } else inp.style.borderColor="";
    if(inp.type==="number") val = Number(val);
    data[inp.dataset.field] = val;
  });
  if(!valid) return;
  if(id===null){ data.id = nextId[key]++; p.rows.push(data); }
  else { Object.assign(p.rows.find(r=>r.id===id), data); }
  editingId[key]=null;
  saveState();
  renderMain();
}

function deleteRow(key,id){
  if(!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
  const p = PORTFOLIOS[key];
  const row = p.rows.find(r=>r.id===id);
  p.rows = p.rows.filter(r=>r.id!==id);
  // Bu koda ait başka satır kalmadıysa, o koda ait eski fiyat geçmişini de temizle
  // (aksi halde silinen hissenin geçmişi, aynı kodla eklenen yeni bir hisseye yanlışlıkla uygulanır)
  if(row && !p.rows.some(r=>r.kod===row.kod)){
    p.history = p.history.filter(h=>h.kod!==row.kod);
  }
  saveState();
  renderMain();
}

/* ============================= CSV EXPORT ============================= */
function exportCSV(key){
  const p = PORTFOLIOS[key];
  const headers = ["Kod","Adet","Alış Fiyatı","Alış Tarihi","Güncel Fiyat","Günlük %","Haftalık %","Yıllık %","3 Yıllık %","Maliyet","Güncel Değer","Kar/Zarar","Kar/Zarar %"];
  const lines = [headers.join(";")];
  p.rows.forEach(r => {
    const c = computed(r,key);
    lines.push([r.kod,r.adet,r.alis,r.alisTarihi,r.guncel,
      pctStr(c.gunluk),pctStr(c.haftalik),pctStr(c.yillik),pctStr(c.ucYillik),
      c.maliyet.toFixed(2), c.guncelDeger.toFixed(2), c.karZarar.toFixed(2), pctStr(c.karZararPct)
    ].join(";"));
  });
  const blob = new Blob(["\uFEFF"+lines.join("\n")], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${key}_portfoy.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function pctStr(v){ return v===null||v===undefined||isNaN(v) ? "" : (v*100).toFixed(1)+"%"; }

/* ============================= CHARTS (bağımsız SVG — CDN gerektirmez) ============================= */
function formatAxisVal(v){
  if(Math.abs(v)>=1000) return (v/1000).toFixed(1)+"k";
  return (Math.round(v*10)/10).toString();
}

function svgPie(container, labels, values, colors){
  const total = values.reduce((a,b)=>a+(b>0?b:0),0);
  const cx=50, cy=50, r=40;
  let angle=-90;
  let paths="";
  const legendItems=[];
  values.forEach((v,i) => {
    const pct = total ? Math.max(v,0)/total : 0;
    const sweep = pct*360;
    const color = colors[i%colors.length];
    if(total>0 && v>0){
      const x1 = cx + r*Math.cos(angle*Math.PI/180);
      const y1 = cy + r*Math.sin(angle*Math.PI/180);
      const endAngle = angle+sweep;
      const x2 = cx + r*Math.cos(endAngle*Math.PI/180);
      const y2 = cy + r*Math.sin(endAngle*Math.PI/180);
      const largeArc = sweep>180?1:0;
      paths += `<path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${largeArc} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z" fill="${color}" stroke="#0a0d10" stroke-width="0.5"><title>${labels[i]}: %${(pct*100).toFixed(1)}</title></path>`;
      angle = endAngle;
    }
    legendItems.push({label:labels[i], pct, color});
  });
  if(!paths){
    container.innerHTML = `<div class="empty-chart">Gösterilecek veri yok</div>`;
    return;
  }
  const svg = `<svg class="svg-chart" viewBox="0 0 100 100" style="max-width:190px;flex:0 0 auto;">${paths}</svg>`;
  const legend = `<ul class="chart-legend">${legendItems.map(it=>`<li><span class="swatch" style="background:${it.color}"></span>${it.label} · %${(it.pct*100).toFixed(1)}</li>`).join("")}</ul>`;
  container.innerHTML = svg + legend;
}

function svgBarGrouped(container, labels, datasets, opts={}){
  if(labels.length===0){ container.innerHTML = `<div class="empty-chart">Gösterilecek veri yok</div>`; return; }
  const suffix = opts.suffix || "";
  const W=600, H=240, padL=48, padR=14, padT=14, padB=32;
  const plotW=W-padL-padR, plotH=H-padT-padB;
  const allVals = datasets.flatMap(d=>d.data);
  let min = Math.min(0,...allVals), max = Math.max(0,...allVals);
  if(min===max) max = min+1;
  const range = max-min;
  const yForVal = v => padT + plotH - ((v-min)/range)*plotH;
  const zeroY = yForVal(0);
  const n = labels.length;
  const groupW = plotW/n;
  const gap=4;
  const barW = Math.max((groupW - gap*(datasets.length+1))/datasets.length, 2);

  let svg = `<svg class="svg-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">`;
  const steps=4;
  for(let i=0;i<=steps;i++){
    const v = min + (range*i/steps);
    const y = yForVal(v);
    svg += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W-padR}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
    svg += `<text x="${padL-6}" y="${(y+3).toFixed(1)}" font-size="9.5" text-anchor="end">${formatAxisVal(v)}${suffix}</text>`;
  }
  svg += `<line x1="${padL}" y1="${zeroY.toFixed(1)}" x2="${W-padR}" y2="${zeroY.toFixed(1)}" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>`;

  labels.forEach((label,i) => {
    const groupX = padL + i*groupW;
    datasets.forEach((ds,j) => {
      const val = ds.data[i] ?? 0;
      const barX = groupX + gap + j*(barW+gap);
      const y1 = yForVal(val);
      const barY = Math.min(y1,zeroY);
      const barH = Math.max(Math.abs(y1-zeroY), 0.5);
      const color = typeof ds.color === "function" ? ds.color(val) : ds.color;
      svg += `<rect x="${barX.toFixed(1)}" y="${barY.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" fill="${color}" rx="2"><title>${label} · ${ds.label}: ${val}${suffix}</title></rect>`;
    });
    svg += `<text x="${(groupX+groupW/2).toFixed(1)}" y="${(H-padB+16).toFixed(1)}" font-size="10" text-anchor="middle">${label}</text>`;
  });
  svg += `</svg>`;

  const showLegend = datasets.length>1;
  const legend = showLegend ? `<ul class="chart-legend">${datasets.map(ds=>`<li><span class="swatch" style="background:${typeof ds.color==='function'?'#8992a0':ds.color}"></span>${ds.label}</li>`).join("")}</ul>` : "";
  container.innerHTML = svg + legend;
}

function pct100(v){ return v===null||v===undefined||isNaN(v) ? 0 : +(v*100).toFixed(1); }

function renderChartsSection(key){
  const p = PORTFOLIOS[key];
  const section = document.createElement("div");
  section.innerHTML = `<div class="section-title">Grafikler</div>`;

  const grid1 = document.createElement("div"); grid1.className="chart-grid";
  grid1.innerHTML = `
    <div class="chart-card"><h4>Portföy Dağılımı (Güncel Değere Göre)</h4><div class="canvas-box" id="box-${key}-pie"></div></div>
    <div class="chart-card"><h4>Hisse Bazında Kar/Zarar</h4><div class="canvas-box" id="box-${key}-pl"></div></div>
  `;
  section.appendChild(grid1);

  const grid2 = document.createElement("div"); grid2.className="chart-grid";
  grid2.innerHTML = `
    <div class="chart-card"><h4>Performans Karşılaştırması (%)</h4><div class="canvas-box" id="box-${key}-perf"></div></div>
    <div class="chart-card"><h4>Maliyet ve Güncel Değer</h4><div class="canvas-box" id="box-${key}-cv"></div></div>
  `;
  section.appendChild(grid2);

  requestAnimationFrame(() => drawCharts(key));
  return section;
}

function drawCharts(key){
  const p = PORTFOLIOS[key];
  const labels = p.rows.map(r=>r.kod);
  const enriched = p.rows.map(r=>({row:r,c:computed(r,key)}));
  const palette = ["#d9a441","#4f8fd1","#3fb6a8","#8a6fd6","#e0554f","#7d9c46","#c2703a","#c25a9e"];

  const pieBox = document.getElementById(`box-${key}-pie`);
  if(pieBox) svgPie(pieBox, labels, enriched.map(e=>e.c.guncelDeger), palette);

  const plBox = document.getElementById(`box-${key}-pl`);
  if(plBox) svgBarGrouped(plBox, labels, [
    {label:"Kar/Zarar", data:enriched.map(e=>e.c.karZarar), color:v=>v>=0?"#22b573":"#e0554f"}
  ], {suffix:""});

  const perfBox = document.getElementById(`box-${key}-perf`);
  if(perfBox) svgBarGrouped(perfBox, labels, [
    {label:"Günlük", data:enriched.map(e=>pct100(e.c.gunluk)), color:"#d9a441"},
    {label:"Haftalık", data:enriched.map(e=>pct100(e.c.haftalik)), color:"#4f8fd1"},
    {label:"Yıllık", data:enriched.map(e=>pct100(e.c.yillik)), color:"#3fb6a8"},
    {label:"3 Yıllık", data:enriched.map(e=>pct100(e.c.ucYillik)), color:"#8a6fd6"},
  ], {suffix:"%"});

  const cvBox = document.getElementById(`box-${key}-cv`);
  if(cvBox) svgBarGrouped(cvBox, labels, [
    {label:"Maliyet", data:enriched.map(e=>e.c.maliyet), color:"#5b6472"},
    {label:"Güncel Değer", data:enriched.map(e=>e.c.guncelDeger), color:p.accent},
  ], {suffix:""});
}

/* ============================= OVERVIEW ============================= */
function renderOverview(){
  const panel = document.createElement("div");
  panel.className = "panel active";

  const fxRow = document.createElement("div");
  fxRow.className = "fx-row";
  fxRow.innerHTML = `<label>USD/TRY Kuru</label><input type="number" step="0.01" id="fxInput" value="${usdTry}"> <span style="color:var(--text-soft); font-size:12px;">— ABD ve Kripto portföylerini TL'ye çevirmek için, kendi güncel kurunuzu girin</span>`;
  panel.appendChild(fxRow);
  requestAnimationFrame(() => {
    document.getElementById("fxInput").addEventListener("input", e => {
      usdTry = Number(e.target.value)||0; saveState(); renderMain();
    });
  });

  const bTot = portfolioTotals("bist"), aTot = portfolioTotals("abd"), fTot = portfolioTotals("fon"), kTot = portfolioTotals("kripto");
  const aTotTL = { maliyet:aTot.maliyet*usdTry, guncelDeger:aTot.guncelDeger*usdTry, karZarar:aTot.karZarar*usdTry };
  const kTotTL = { maliyet:kTot.maliyet*usdTry, guncelDeger:kTot.guncelDeger*usdTry, karZarar:kTot.karZarar*usdTry };
  const grandMaliyet = bTot.maliyet + aTotTL.maliyet + fTot.maliyet + kTotTL.maliyet;
  const grandDeger = bTot.guncelDeger + aTotTL.guncelDeger + fTot.guncelDeger + kTotTL.guncelDeger;
  const grandKZ = grandDeger - grandMaliyet;
  const grandKZPct = safeDiv(grandKZ, grandMaliyet);

  const cards = document.createElement("div");
  cards.className = "cards";
  cards.innerHTML = `
    <div class="card"><div class="label">Toplam Maliyet (TL eşd.)</div><div class="value">${fmtMoneyPlain(grandMaliyet,"TL")}</div></div>
    <div class="card"><div class="label">Toplam Güncel Değer (TL eşd.)</div><div class="value">${fmtMoneyPlain(grandDeger,"TL")}</div></div>
    <div class="card"><div class="label">Toplam Kar/Zarar</div><div class="value ${pctClass(grandKZ)}">${fmtMoney(grandKZ,"TL")}</div><div class="sub ${pctClass(grandKZPct)}">${fmtPct(grandKZPct)}</div></div>
  `;
  panel.appendChild(cards);

  const section = document.createElement("div");
  section.innerHTML = `<div class="section-title">Portföyler Arası Dağılım (TL Eşdeğeri)</div>`;
  const grid = document.createElement("div"); grid.className="chart-grid";
  grid.innerHTML = `
    <div class="chart-card"><h4>Portföy Payları</h4><div class="canvas-box" id="box-ov-pie"></div></div>
    <div class="chart-card"><h4>Portföy Bazında Kar/Zarar (TL Eşd.)</h4><div class="canvas-box" id="box-ov-pl"></div></div>
  `;
  section.appendChild(grid);
  panel.appendChild(section);

  requestAnimationFrame(() => {
    const pieBox = document.getElementById("box-ov-pie");
    if(pieBox) svgPie(pieBox, ["BIST","ABD","Fon","Kripto"], [bTot.guncelDeger, aTotTL.guncelDeger, fTot.guncelDeger, kTotTL.guncelDeger], ["#d9a441","#4f8fd1","#3fb6a8","#e0954f"]);
    const plBox = document.getElementById("box-ov-pl");
    if(plBox) svgBarGrouped(plBox, ["BIST","ABD","Fon","Kripto"], [
      {label:"Kar/Zarar (TL)", data:[bTot.karZarar, aTotTL.karZarar, fTot.karZarar, kTotTL.karZarar], color:v=>v>=0?"#22b573":"#e0554f"}
    ], {suffix:""});
  });

  return panel;
}

/* ============================= MAKROEKONOMİK VERİLER (bağımsız bölüm) ============================= */
function macroCounts(){
  let total=0, done=0;
  MACRO.categories.forEach(cat => cat.items.forEach(it => { total++; if(it.incelendi) done++; }));
  return {total, done};
}

function renderMacroPanel(){
  const panel = document.createElement("div");
  panel.className = "panel active";
  panel.style.setProperty("--accent", "#c2703a");

  const {total, done} = macroCounts();
  const cards = document.createElement("div");
  cards.className = "cards";
  cards.innerHTML = `
    <div class="card"><div class="label">Toplam Gösterge</div><div class="value">${total}</div></div>
    <div class="card"><div class="label">İncelenen</div><div class="value pos">${done}</div></div>
    <div class="card"><div class="label">Bekleyen</div><div class="value">${total-done}</div></div>
    <div class="card"><div class="label">Tamamlanma</div><div class="value">%${total?Math.round(done/total*100):0}</div></div>
  `;
  panel.appendChild(cards);

  const grid = document.createElement("div");
  grid.className = "macro-grid";
  MACRO.categories.forEach(cat => {
    const catDone = cat.items.filter(i=>i.incelendi).length;
    const card = document.createElement("div");
    card.className = "macro-card";
    card.innerHTML = `
      <div class="macro-card-head">
        <h4>${cat.label}</h4>
        <span class="macro-count">${catDone}/${cat.items.length}</span>
      </div>
      <ul class="macro-list">
        ${cat.items.map(it => `
          <li class="macro-item ${it.incelendi?'done':''}" data-cat="${cat.key}" data-id="${it.id}">
            <label class="macro-check">
              <input type="checkbox" ${it.incelendi?'checked':''} data-act="toggle" data-cat="${cat.key}" data-id="${it.id}">
              <span>${it.isim}</span>
            </label>
            <div class="macro-item-right">
              ${it.incelendi
                ? `<input type="date" class="macro-date" value="${it.tarih||''}" data-act="date" data-cat="${cat.key}" data-id="${it.id}">`
                : `<span class="macro-date-empty">—</span>`}
              <button class="btn btn-sm btn-danger" data-act="del" data-cat="${cat.key}" data-id="${it.id}">✕</button>
            </div>
          </li>
        `).join("")}
      </ul>
      <div class="macro-add-row">
        <input type="text" class="macro-add-input" placeholder="Yeni gösterge adı…" data-cat="${cat.key}">
        <button class="btn btn-sm btn-accent" data-act="add" data-cat="${cat.key}">+ Ekle</button>
      </div>
    `;
    grid.appendChild(card);
  });
  panel.appendChild(grid);

  // ---- event wiring ----
  grid.querySelectorAll('input[data-act="toggle"]').forEach(cb => {
    cb.addEventListener("change", () => {
      toggleMacroItem(cb.dataset.cat, Number(cb.dataset.id), cb.checked);
    });
  });
  grid.querySelectorAll('input[data-act="date"]').forEach(inp => {
    inp.addEventListener("change", () => {
      setMacroDate(inp.dataset.cat, Number(inp.dataset.id), inp.value);
    });
  });
  grid.querySelectorAll('button[data-act="del"]').forEach(btn => {
    btn.addEventListener("click", () => {
      deleteMacroItem(btn.dataset.cat, Number(btn.dataset.id));
    });
  });
  grid.querySelectorAll('button[data-act="add"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      const input = grid.querySelector(`.macro-add-input[data-cat="${cat}"]`);
      const isim = input.value.trim();
      if(!isim) return;
      addMacroItem(cat, isim);
    });
  });

  return panel;
}

function findMacroCat(catKey){ return MACRO.categories.find(c=>c.key===catKey); }

function toggleMacroItem(catKey, id, checked){
  const cat = findMacroCat(catKey); if(!cat) return;
  const item = cat.items.find(i=>i.id===id); if(!item) return;
  item.incelendi = checked;
  if(checked && !item.tarih) item.tarih = new Date().toISOString().slice(0,10);
  if(!checked) item.tarih = null;
  saveState();
  renderMain();
}
function setMacroDate(catKey, id, tarih){
  const cat = findMacroCat(catKey); if(!cat) return;
  const item = cat.items.find(i=>i.id===id); if(!item) return;
  item.tarih = tarih;
  saveState();
  renderMain();
}
function deleteMacroItem(catKey, id){
  const cat = findMacroCat(catKey); if(!cat) return;
  if(!confirm("Bu göstergeyi silmek istediğinize emin misiniz?")) return;
  cat.items = cat.items.filter(i=>i.id!==id);
  saveState();
  renderMain();
}
function addMacroItem(catKey, isim){
  const cat = findMacroCat(catKey); if(!cat) return;
  cat.items.push({id:macroNextId++, isim, incelendi:false, tarih:null});
  saveState();
  renderMain();
}

/* ============================= INIT ============================= */
loadState();
renderMain();
pullFromCloud(true).then(ok => { if(ok) renderMain(); });