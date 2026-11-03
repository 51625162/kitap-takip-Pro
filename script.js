// ============================================================
//  OKUMA ROKETİ — Kitap Takip
//  Veri kullanıcı bazlı ayrılır: TALHA ve ZEYNEP birbirinden
//  tamamen bağımsız kendi kayıtlarını görür (localStorage anahtarı
//  kullanıcı adına göre son ek alır, örn. 'kitapKayitlari_TALHA').
//  Eski (kullanıcısız) veriler otomatik olarak TALHA'ya taşınır —
//  hiçbir kayıt silinmez.
// ============================================================

const KULLANICILAR = {
  TALHA: { sifre: '54321' },
  ZEYNEP: { sifre: '190344' },
};

let aktifKullanici = localStorage.getItem('aktifKullanici') || null;

let kayitlar = [];
let kisiler = [];
let dosyaArsivi = [];
let evcilHayvanlar = {}; // { "İsim": "kedi" }
let evrimGosterildi = {}; // { "İsim": son gösterilen evrim aşaması } — ses/kutlama tekrarını önler

let duzenlenenIndex = -1;
let grafik = null;
let gelisimGrafik = null;

const RENKLER = ['#F6B93B', '#FF6F91', '#3DDC97', '#5D9CEC', '#B98CE0', '#FF9F43', '#5AC8FA'];

// Kupa: her KAÇ tamamlanan kitapta bir kupa kazanılır.
const KUPA_ARALIGI = 25;

// Evrim eşikleri: bu kadar KİTAP TAMAMLAYINCA hayvan bir üst forma geçer.
const EVRIM_ESIKLERI = [50, 100, 150, 200];

const HAYVAN_TURLERI = {
  kedi: {
    ad: 'Kedigiller Ailesi',
    asamalar: [
      { ad: 'Yavru Kedi', emoji: '🐱' },
      { ad: 'Genç Panter', emoji: '🐆' },
      { ad: 'Kaplan', emoji: '🐅' },
      { ad: 'Efsanevi Altın Aslan', emoji: '🦁' },
    ],
  },
  kertenkele: {
    ad: 'Ejderha Ailesi',
    asamalar: [
      { ad: 'Yavru Kertenkele', emoji: '🦎' },
      { ad: 'Ejderha Yavrusu', emoji: '🐉' },
      { ad: 'Genç Ejderha', emoji: '🐲' },
      { ad: 'Efsanevi Gökkuşağı Ejderhası', emoji: '🐉🌈' },
    ],
  },
  kurt: {
    ad: 'Kurt Ailesi',
    asamalar: [
      { ad: 'Kurt Yavrusu', emoji: '🐺' },
      { ad: 'Genç Kurt', emoji: '🐺' },
      { ad: 'Kutup Kurdu', emoji: '🐺' },
      { ad: 'Efsanevi Ay Kurdu', emoji: '🐺' },
    ],
  },
  kus: {
    ad: 'Kuş Ailesi',
    asamalar: [
      { ad: 'Yavru Kuş', emoji: '🐣' },
      { ad: 'Genç Şahin', emoji: '🦅' },
      { ad: 'Kartal', emoji: '🦅' },
      { ad: 'Efsanevi Anka Kuşu', emoji: '🐦‍🔥' },
    ],
  },
  balik: {
    ad: 'Deniz Ailesi',
    asamalar: [
      { ad: 'Yavru Balık', emoji: '🐠' },
      { ad: 'Genç Yunus', emoji: '🐬' },
      { ad: 'Deniz Canavarı', emoji: '🐋' },
      { ad: 'Efsanevi Deniz Ejderhası', emoji: '🐉' },
    ],
  },
};

// ------------------------------------------------------------
// YARDIMCI FONKSİYONLAR
// ------------------------------------------------------------
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function bugunYYYYMMDD() {
  return new Date().toISOString().slice(0, 10);
}

function formatTarih(iso) {
  if (!iso) return '-';
  const parcalar = iso.split('-');
  if (parcalar.length !== 3) return iso;
  const [y, m, d] = parcalar;
  return `${d}.${m}.${y}`;
}

function boyutFormatla(bayt) {
  if (!bayt) return '0 B';
  if (bayt < 1024) return bayt + ' B';
  if (bayt < 1024 * 1024) return (bayt / 1024).toFixed(1) + ' KB';
  return (bayt / 1024 / 1024).toFixed(1) + ' MB';
}

// ------------------------------------------------------------
// KULLANICI BAZLI VERİ (her hesap kendi anahtarını kullanır)
// ------------------------------------------------------------
function anahtar(taban) {
  return `${taban}_${aktifKullanici}`;
}

function eskiVeriyiTalhaTasi() {
  // İlk sürümde tek kullanıcı vardı ve anahtarlar son ek almıyordu.
  // Bu veriyi kaybetmemek için bir kereliğine TALHA hesabına kopyalıyoruz.
  ['kitapKayitlari', 'kisiler', 'dosyaArsivi', 'evcilHayvanlar'].forEach(taban => {
    const eski = localStorage.getItem(taban);
    const yeniAnahtar = `${taban}_TALHA`;
    if (eski && !localStorage.getItem(yeniAnahtar)) {
      localStorage.setItem(yeniAnahtar, eski);
    }
  });
}

function verileriYukle() {
  if (aktifKullanici === 'TALHA') eskiVeriyiTalhaTasi();

  kayitlar = JSON.parse(localStorage.getItem(anahtar('kitapKayitlari'))) || [];
  kisiler = JSON.parse(localStorage.getItem(anahtar('kisiler'))) || [];
  dosyaArsivi = JSON.parse(localStorage.getItem(anahtar('dosyaArsivi'))) || [];
  evcilHayvanlar = JSON.parse(localStorage.getItem(anahtar('evcilHayvanlar'))) || {};
  evrimGosterildi = JSON.parse(localStorage.getItem(anahtar('evrimGosterildi'))) || {};

  kisilerDuplikeTemizle();
}

// "TALHA" ve "Talha" gibi sadece büyük/küçük harfi farklı isimler yanlışlıkla
// iki ayrı kaşif olarak eklenmiş olabilir (örn. isim kutusuna farklı yazılırsa).
// Bu, ilerlemesi olan asıl kişinin yanında ilerlemesi sıfır görünen bir "hayalet"
// kart oluşturur. Burada bu tür kopyalar otomatik olarak birleştirilir — ilk
// eklenen isim esas alınır, kopyanın kayıtları (varsa) ona aktarılır, veri kaybı olmaz.
function kisilerDuplikeTemizle() {
  const normalize = s => String(s).trim().toLocaleLowerCase('tr');
  const kanonikIsim = new Map(); // normalize edilmiş isim -> ilk görülen orijinal isim
  const yeniKisiler = [];
  let degisiklikVarMi = false;

  kisiler.forEach(ad => {
    const norm = normalize(ad);
    if (kanonikIsim.has(norm)) {
      degisiklikVarMi = true;
    } else {
      kanonikIsim.set(norm, ad);
      yeniKisiler.push(ad);
    }
  });

  if (!degisiklikVarMi) return;

  kayitlar.forEach(k => {
    const kanonik = kanonikIsim.get(normalize(k.kisi));
    if (kanonik) k.kisi = kanonik;
  });

  const yeniEvcilHayvanlar = {};
  Object.keys(evcilHayvanlar).forEach(isim => {
    const kanonik = kanonikIsim.get(normalize(isim)) || isim;
    if (!yeniEvcilHayvanlar[kanonik]) yeniEvcilHayvanlar[kanonik] = evcilHayvanlar[isim];
  });

  kisiler = yeniKisiler;
  evcilHayvanlar = yeniEvcilHayvanlar;
  kaydetVeri();
  kaydetEvcilHayvanlar();
}

function kaydetVeri() {
  localStorage.setItem(anahtar('kitapKayitlari'), JSON.stringify(kayitlar));
  localStorage.setItem(anahtar('kisiler'), JSON.stringify(kisiler));
}

function kaydetDosyaArsivi() {
  localStorage.setItem(anahtar('dosyaArsivi'), JSON.stringify(dosyaArsivi));
}

function kaydetEvcilHayvanlar() {
  localStorage.setItem(anahtar('evcilHayvanlar'), JSON.stringify(evcilHayvanlar));
}

function kaydetEvrimGosterildi() {
  localStorage.setItem(anahtar('evrimGosterildi'), JSON.stringify(evrimGosterildi));
}

function evrimAsamasi(kitapSayisi) {
  let asama = -1;
  EVRIM_ESIKLERI.forEach((esik, i) => { if (kitapSayisi >= esik) asama = i; });
  return asama; // -1: henüz kilitli, 0-3: evrim aşaması
}

function evcilHayvanSec(isim, tur) {
  if (!HAYVAN_TURLERI[tur]) return;
  evcilHayvanlar[isim] = tur;
  kaydetEvcilHayvanlar();
  kisiKartlariniOlustur();
}

// ------------------------------------------------------------
// GELİŞİM MESAJLARI (bu hafta / geçen hafta karşılaştırması)
// ------------------------------------------------------------
function haftalikSayfa(isim, kacGunOnce, kacGunSuresi) {
  const bugun = new Date();
  const bitis = new Date(bugun); bitis.setDate(bugun.getDate() - kacGunOnce);
  const baslangic = new Date(bitis); baslangic.setDate(bitis.getDate() - kacGunSuresi);

  return kayitlar
    .filter(k => k.kisi === isim && k.tarih)
    .filter(k => {
      const t = new Date(k.tarih);
      return t > baslangic && t <= bitis;
    })
    .reduce((toplam, k) => toplam + Number(k.okunanSayfa || 0), 0);
}

function gelisimMesajiOlustur(isim) {
  const buHafta = haftalikSayfa(isim, 0, 7);
  const gecenHafta = haftalikSayfa(isim, 7, 7);

  if (buHafta === 0 && gecenHafta === 0) {
    return { emoji: '🌱', metin: 'Yeni bir okuma haftasına başlamaya hazır mısın?' };
  }
  if (gecenHafta === 0) {
    return { emoji: '🚀', metin: `Bu hafta ${buHafta} sayfa okudun — harika bir başlangıç!` };
  }

  const fark = Math.round(((buHafta - gecenHafta) / gecenHafta) * 100);

  if (fark > 10) return { emoji: '📈', metin: `Bu hafta geçen haftaya göre %${fark} daha çok okudun. Süpersin!` };
  if (fark >= -10) return { emoji: '⭐', metin: 'İstikrarlı gidiyorsun, böyle devam et!' };
  return { emoji: '💪', metin: 'Bu hafta biraz yavaşladın ama her sayfa değerli, hadi devam edelim!' };
}

// ------------------------------------------------------------
// HAYVAN SESLERİ (Web Audio API ile sentezlenir — dosya indirmez,
// tamamen offline çalışır, telif hakkı sorunu yaratmaz)
// ------------------------------------------------------------
let sesBaglami = null;

function sesBaglaminiAl() {
  if (!sesBaglami) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      try { sesBaglami = new AC(); } catch (e) { sesBaglami = null; }
    }
  }
  if (sesBaglami && sesBaglami.state === 'suspended') {
    sesBaglami.resume().catch(() => {});
  }
  return sesBaglami;
}

// Tarayıcılar, kullanıcı hiç dokunmadan otomatik ses çalınmasını engeller.
// Bazı sesler (örn. yeni evrim kutlaması) doğrudan bir tıklamadan değil,
// ekran güncellenirken kendiliğinden tetiklenebiliyor — özellikle sayfa zaten
// girişliyken yeniden açıldığında. Bunu önlemek için sayfadaki ilk dokunuşta/
// tıklamada ses altyapısının kilidini erkenden açıyoruz. Kilit ilk kez
// açıldığında, daha önce (ses kilidi kapalıyken) sessizce atlanmış olabilecek
// kutlama seslerini yakalamak için kişi kartlarını bir kez daha tazeliyoruz.
let sesKilidiAcikMi = false;
function sesKilidiniDenemeyeCalis() {
  const ctx = sesBaglaminiAl();
  if (ctx && ctx.state === 'running' && !sesKilidiAcikMi) {
    sesKilidiAcikMi = true;
    if (typeof kisiKartlariniOlustur === 'function') kisiKartlariniOlustur();
  }
}
document.addEventListener('pointerdown', sesKilidiniDenemeyeCalis, { capture: true });
document.addEventListener('keydown', sesKilidiniDenemeyeCalis, { capture: true });

function tonCal(frekans, sure, tur = 'sine', gecikme = 0, sesSeviyesi = 0.2) {
  const ctx = sesBaglaminiAl();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const kazanc = ctx.createGain();
    osc.type = tur;
    osc.frequency.setValueAtTime(frekans, ctx.currentTime + gecikme);
    kazanc.gain.setValueAtTime(0, ctx.currentTime + gecikme);
    kazanc.gain.linearRampToValueAtTime(sesSeviyesi, ctx.currentTime + gecikme + 0.02);
    kazanc.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + gecikme + sure);
    osc.connect(kazanc).connect(ctx.destination);
    osc.start(ctx.currentTime + gecikme);
    osc.stop(ctx.currentTime + gecikme + sure + 0.03);
  } catch (e) { /* sessizce yoksay */ }
}

function kaymaliTonCal(baslangic, bitis, sure, tur = 'sine', sesSeviyesi = 0.22, gecikme = 0) {
  const ctx = sesBaglaminiAl();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const kazanc = ctx.createGain();
    osc.type = tur;
    osc.frequency.setValueAtTime(baslangic, ctx.currentTime + gecikme);
    osc.frequency.exponentialRampToValueAtTime(Math.max(bitis, 1), ctx.currentTime + gecikme + sure);
    kazanc.gain.setValueAtTime(0, ctx.currentTime + gecikme);
    kazanc.gain.linearRampToValueAtTime(sesSeviyesi, ctx.currentTime + gecikme + 0.03);
    kazanc.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + gecikme + sure);
    osc.connect(kazanc).connect(ctx.destination);
    osc.start(ctx.currentTime + gecikme);
    osc.stop(ctx.currentTime + gecikme + sure + 0.03);
  } catch (e) { /* sessizce yoksay */ }
}

const HAYVAN_SESLERI = {
  kedi: (asama) => {
    const carpan = 1 + asama * 0.18;
    tonCal(500 * carpan, 0.12, 'sine', 0, 0.2);
    tonCal(660 * carpan, 0.18, 'sine', 0.12, 0.2);
  },
  kertenkele: (asama) => {
    const derinlik = 150 - asama * 25;
    kaymaliTonCal(derinlik, derinlik * 0.55, 0.55 + asama * 0.15, 'sawtooth', 0.22);
    if (asama >= 2) tonCal(950, 0.12, 'square', 0.35, 0.12);
  },
  kurt: (asama) => {
    const tepe = 300 + asama * 45;
    kaymaliTonCal(tepe * 0.55, tepe, 0.2, 'sine', 0.18);
    kaymaliTonCal(tepe, tepe * 0.45, 0.65 + asama * 0.1, 'sine', 0.2, 0.2);
  },
  kus: (asama) => {
    // Kartal çağrısı: uzun, keskin çığlık; altında hafif boğuk ikinci katman.
    // Evrim aşaması yükseldikçe ses daha tok ve güçlü duyulur.
    const guc = 1 + Math.max(0, asama) * 0.08;
    const tiz = 1850 - Math.max(0, asama) * 70;
    kaymaliTonCal(tiz, tiz * 0.72, 0.62, 'sine', 0.25 * guc, 0);
    kaymaliTonCal(tiz * 0.98, tiz * 0.58, 0.48, 'triangle', 0.13 * guc, 0.08);
    kaymaliTonCal(720 + asama * 35, 480 + asama * 25, 0.52, 'sawtooth', 0.075 * guc, 0.04);
    kaymaliTonCal(tiz * 0.78, tiz * 0.95, 0.22, 'sine', 0.16 * guc, 0.58);
    kaymaliTonCal(tiz * 0.92, tiz * 0.62, 0.38, 'sine', 0.20 * guc, 0.82);
    if (asama >= 1) {
      kaymaliTonCal(tiz * 0.68, tiz * 0.52, 0.42, 'triangle', 0.14 * guc, 1.12);
      kaymaliTonCal(610 + asama * 30, 390 + asama * 20, 0.46, 'sawtooth', 0.07 * guc, 1.1);
    }
  },
  balik: (asama) => {
    for (let i = 0; i < 3; i++) tonCal(700 + Math.random() * 300 + asama * 60, 0.08, 'sine', i * 0.09, 0.15);
  },
};

async function hayvanSesiCal(tur, asama) {
  // Kuş/kartal sesi harici MP3'e bağlı değildir: dokunma ile yerel WebAudio
  // çağrısı üretir. Böylece bağlantı/CORS sorunu nedeniyle sessiz kalmaz.
  if (tur === 'kus') {
    // Kartal için gerçek MP3 kaydı kullanılır.
    try {
      const url = 'https://www.orangefreesounds.com/wp-content/uploads/2014/10/Eagle-sound.mp3';
      if (window.kartalSesAudio) {
        window.kartalSesAudio.pause();
        window.kartalSesAudio.currentTime = 0;
      }
      window.kartalSesAudio = new Audio(url);
      window.kartalSesAudio.preload = 'auto';
      window.kartalSesAudio.volume = 0.9;
      await window.kartalSesAudio.play();
    } catch (e) {
      console.warn('Gerçek kartal sesi başlatılamadı:', e);
      if (typeof showToast === 'function') showToast('Kartal kaydı açılamadı. İnternet bağlantısını ve medya sesini kontrol et.');
    }
    return;
  }
  const fn = HAYVAN_SESLERI[tur];
  if (!fn) return;
  const ctx = sesBaglaminiAl();
  if (!ctx) return;
  try {
    if (ctx.state !== 'running') await ctx.resume();
    if (ctx.state === 'running') fn(Math.max(0, Number(asama) || 0));
  } catch (e) {
    console.warn('Hayvan sesi başlatılamadı:', e);
  }
}

// ------------------------------------------------------------
// BAŞLATMA / GİRİŞ
// ------------------------------------------------------------
window.onload = function () {
  if (localStorage.getItem("girisYapildi") === "true" && aktifKullanici && KULLANICILAR[aktifKullanici]) {
    verileriYukle();
    girisGoster(false);
    aktifKullaniciEtiketiniGuncelle();
  } else {
    girisGoster(true);
  }

  if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
    const t = document.getElementById("temaBtn");
    if (t) t.innerText = "☀️ Aydınlık Mod";
  }

  bugununTarihiniAyarla();
  tumunuGuncelle();
};

function girisGoster(goster) {
  document.getElementById("girisEkrani").style.display = goster ? "flex" : "none";
  document.getElementById("uygulama").style.display = goster ? "none" : "block";
}

function aktifKullaniciEtiketiniGuncelle() {
  const etiket = document.getElementById('aktifKullaniciEtiketi');
  if (etiket) etiket.innerText = aktifKullanici ? `👤 ${aktifKullanici}` : '';
}

function bugununTarihiniAyarla() {
  const t = document.getElementById('tarih');
  if (t && !t.value) t.value = bugunYYYYMMDD();
}

const girisBtn = document.getElementById("girisBtn");
if (girisBtn) {
  girisBtn.addEventListener("click", function () {
    const girilenAd = document.getElementById("kullaniciAdi").value.trim().toUpperCase();
    const sifre = document.getElementById("sifre").value.trim();
    const hesap = KULLANICILAR[girilenAd];

    if (hesap && hesap.sifre === sifre) {
      aktifKullanici = girilenAd;
      localStorage.setItem("aktifKullanici", aktifKullanici);
      localStorage.setItem("girisYapildi", "true");
      document.getElementById("hata").innerText = "";
      verileriYukle();
      girisGoster(false);
      aktifKullaniciEtiketiniGuncelle();
      tumunuGuncelle();
    } else {
      document.getElementById("hata").innerText = "Kullanıcı adı veya şifre yanlış!";
    }
  });
}

['kullaniciAdi', 'sifre'].forEach((id, i, arr) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (i < arr.length - 1) document.getElementById(arr[i + 1]).focus();
    else girisBtn.click();
  });
});

const cikisBtn = document.getElementById("cikisBtn");
if (cikisBtn) {
  cikisBtn.addEventListener("click", function () {
    if (confirm("Çıkış yapmak istiyor musunuz?")) {
      localStorage.removeItem("girisYapildi");
      girisGoster(true);
      document.getElementById("sifre").value = '';
      document.getElementById("kullaniciAdi").value = '';
      const etiket = document.getElementById('aktifKullaniciEtiketi');
      if (etiket) etiket.innerText = '';
    }
  });
}

const temaBtn = document.getElementById("temaBtn");
if (temaBtn) {
  temaBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("tema", "dark");
      temaBtn.innerText = "☀️ Aydınlık Mod";
    } else {
      localStorage.setItem("tema", "light");
      temaBtn.innerText = "🌙 Karanlık Mod";
    }
  });
}

// ------------------------------------------------------------
// KİŞİ YÖNETİMİ
// ------------------------------------------------------------
const kisiEkleBtn = document.getElementById('kisiEkleBtn');
if (kisiEkleBtn) kisiEkleBtn.addEventListener('click', kisiEkle);

const yeniKisiInput = document.getElementById('yeniKisi');
if (yeniKisiInput) {
  yeniKisiInput.addEventListener('keydown', e => { if (e.key === 'Enter') kisiEkle(); });
}

function kisiEkle() {
  const input = document.getElementById('yeniKisi');
  const ad = input.value.trim();

  if (ad === '') { alert('Kişi adı giriniz.'); return; }
  if (kisiler.some(k => k.trim().toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'))) {
    alert('Bu kişi zaten kayıtlı.');
    return;
  }

  kisiler.push(ad);
  kaydetVeri();
  input.value = '';
  tumunuGuncelle();
}

function kisiSil(isim) {
  if (!confirm(`"${isim}" ve tüm okuma kayıtları silinsin mi? Bu işlem geri alınamaz.`)) return;
  kisiler = kisiler.filter(k => k !== isim);
  kayitlar = kayitlar.filter(k => k.kisi !== isim);
  delete evcilHayvanlar[isim];
  delete evrimGosterildi[isim];
  kaydetVeri();
  kaydetEvcilHayvanlar();
  kaydetEvrimGosterildi();
  tumunuGuncelle();
}

function kisiListesiniGuncelle() {
  const select = document.getElementById('kisi');
  const liste = document.getElementById('kisiListesi');

  if (select) {
    const secili = select.value;
    select.innerHTML = kisiler.map(ad => `<option value="${escapeHtml(ad)}">${escapeHtml(ad)}</option>`).join('');
    if (kisiler.includes(secili)) select.value = secili;
  }
  if (liste) {
    liste.innerHTML = kisiler.map(ad => `<option value="${escapeHtml(ad)}">${escapeHtml(ad)}</option>`).join('');
  }
  const excelSecim = document.getElementById('excelKisiSecimi');
  if (excelSecim) {
    const eskiSecim = excelSecim.value;
    excelSecim.innerHTML = '<option value="">Excel için okuyucu seç</option>' + kisiler.map(ad => `<option value="${escapeHtml(ad)}">${escapeHtml(ad)}</option>`).join('');
    if (kisiler.includes(eskiSecim)) excelSecim.value = eskiSecim;
  }
}

// ------------------------------------------------------------
// İSTATİSTİK HESAPLAMA (kaynak: kayıtlar, tek yerden hesaplanır)
// ------------------------------------------------------------
function kisiIstatistikleri(isim) {
  const kayitlarim = kayitlar.filter(k => k.kisi === isim);
  const toplamSayfa = kayitlarim.reduce((t, k) => t + Number(k.okunanSayfa || 0), 0);

  // Kitap adı büyük/küçük harf veya baş-son boşluk farkıyla yazılmış olabilir
  // (örn. "Küçük Prens" / "küçük prens"). Bunları aynı kitap say, ilk yazılan
  // hâlini görünen isim olarak kullan — yoksa sayfalar iki ayrı kitaba
  // bölünüp kitap hiç "tamamlandı" görünmeyebilir.
  const normalizeAd = s => String(s || '').trim().toLocaleLowerCase('tr');

  const kitaplarMap = {};
  kayitlarim.forEach(k => {
    const anahtar = normalizeAd(k.kitap);
    if (!kitaplarMap[anahtar]) {
      kitaplarMap[anahtar] = { kitap: k.kitap, yazar: k.yazar, toplamSayfa: 0, okunan: 0, sonTarih: k.tarih || '' };
    }
    kitaplarMap[anahtar].toplamSayfa = Math.max(kitaplarMap[anahtar].toplamSayfa, Number(k.toplamSayfa || 0));
    kitaplarMap[anahtar].okunan += Number(k.okunanSayfa || 0);
    if ((k.tarih || '') > kitaplarMap[anahtar].sonTarih) kitaplarMap[anahtar].sonTarih = k.tarih;
    if (!kitaplarMap[anahtar].yazar && k.yazar) kitaplarMap[anahtar].yazar = k.yazar;
  });

  const kitaplar = Object.values(kitaplarMap);
  const tamamlanan = kitaplar.filter(kt => kt.toplamSayfa > 0 && kt.okunan >= kt.toplamSayfa);
  const devamEden = kitaplar.filter(kt => !(kt.toplamSayfa > 0 && kt.okunan >= kt.toplamSayfa));
  const gunSayisi = new Set(kayitlarim.map(k => k.tarih).filter(Boolean)).size;

  return { toplamSayfa, kitaplar, tamamlanan, devamEden, gunSayisi };
}

const KILOMETRE_TASLARI = [
  { sinir: 0,    ad: 'Fırlatma Rampası',  emoji: '🚀' },
  { sinir: 100,  ad: 'Ay Kaşifi',         emoji: '🌙' },
  { sinir: 500,  ad: 'Mars Gezgini',      emoji: '🔴' },
  { sinir: 1000, ad: 'Jüpiter Kaşifi',    emoji: '🪐' },
  { sinir: 2500, ad: 'Galaksi Efsanesi',  emoji: '☀️' },
];
const UCUS_TAVANI = 2500;

function rozetBul(sayfa) {
  let sonuc = KILOMETRE_TASLARI[0];
  KILOMETRE_TASLARI.forEach(k => { if (sayfa >= k.sinir) sonuc = k; });
  return { ad: sonuc.ad, emoji: sonuc.emoji };
}

// ------------------------------------------------------------
// KİŞİ KARTLARI — "Uçuş Paneli": her okuyucu bir roket, okunan
// sayfa arttıkça roket gezegenlere doğru yükselir.
// ------------------------------------------------------------
function kisiKartlariniOlustur() {
  const alan = document.getElementById('kisiKartlari');
  if (!alan) return;

  if (kisiler.length === 0) {
    alan.innerHTML = `<div class="bosDurum">🚀 Henüz kaşif eklenmedi. Aşağıdan yeni bir okuyucu ekleyerek uzay yolculuğuna başlayın!</div>`;
    return;
  }

  alan.innerHTML = kisiler.map(isim => {
    const ist = kisiIstatistikleri(isim);
    const rozet = rozetBul(ist.toplamSayfa);
    const roketKonumu = Math.max(3, Math.min(97, (ist.toplamSayfa / UCUS_TAVANI) * 100));

    const gezegenler = KILOMETRE_TASLARI.map(k => {
      const konum = Math.min(97, (k.sinir / UCUS_TAVANI) * 100);
      const aktif = ist.toplamSayfa >= k.sinir;
      return `<div class="gezegen ${aktif ? 'gezegenAktif' : ''}" style="bottom:${konum}%" title="${escapeHtml(k.ad)} — ${k.sinir} sayfa">${k.emoji}</div>`;
    }).join('');

    const yildizlar = ist.tamamlanan.map(kt =>
      `<span class="yildizRozeti" title="${escapeHtml(kt.kitap)} — ${escapeHtml(kt.yazar || 'Yazar bilinmiyor')}">⭐</span>`
    ).join('');

    // Kupa Dolabı — her KUPA_ARALIGI tamamlanan kitapta bir kupa
    const tamamlananSayisi = ist.tamamlanan.length;
    const kupaAdedi = Math.floor(tamamlananSayisi / KUPA_ARALIGI);
    const kupaGosterim = kupaAdedi > 0
      ? Array(Math.min(kupaAdedi, 8)).fill('🏆').join('') + (kupaAdedi > 8 ? ` +${kupaAdedi - 8}` : '')
      : '';
    const kupayaKalan = KUPA_ARALIGI - (tamamlananSayisi % KUPA_ARALIGI);

    // Büyülü Dost — her EVRIM_ESIKLERI[i] tamamlanan kitapta bir evrim aşaması
    const asama = evrimAsamasi(tamamlananSayisi);
    let hayvanHtml;

    if (asama < 0) {
      const kalan = EVRIM_ESIKLERI[0] - tamamlananSayisi;
      hayvanHtml = `<div class="hayvanKilit">🔒 ${kalan} kitap daha tamamlayınca büyülü bir dost kazanacaksın!</div>`;
    } else if (!evcilHayvanlar[isim]) {
      hayvanHtml = `
        <div class="hayvanSecim">
          <p>🎉 Büyülü bir dost kazandın! Birini seç (🔊 ile sesini dinleyebilirsin):</p>
          <div class="hayvanSecenekleri">
            ${Object.entries(HAYVAN_TURLERI).map(([key, tur]) => `
              <div class="hayvanSecenek">
                <button class="hayvanSecBtn" data-isim="${escapeHtml(isim)}" data-tur="${key}" title="${escapeHtml(tur.ad)} — seçmek için tıkla">${tur.asamalar[0].emoji}</button>
                <button class="hayvanOnizlemeBtn" data-tur="${key}" data-asama="0" title="Sesini dinle">🔊</button>
              </div>
            `).join('')}
          </div>
        </div>`;
    } else {
      const tur = HAYVAN_TURLERI[evcilHayvanlar[isim]];
      const mevcut = tur.asamalar[asama];
      const sonrakiEsik = EVRIM_ESIKLERI[asama + 1];
      const oncekiEsik = EVRIM_ESIKLERI[asama];
      const efsaneMi = asama === EVRIM_ESIKLERI.length - 1;

      // Yeni bir evrim aşamasına ilk kez ulaşıldığında kutlama sesi çal.
      // Sesi yalnızca ses altyapısı gerçekten çalışır durumdaysa "gösterildi"
      // say — yoksa tarayıcı otomatik oynatmayı engellediğinde ses sessizce
      // kaybolur ve bir daha hiç çalınmazdı.
      if ((evrimGosterildi[isim] ?? -1) < asama) {
        const sesCtx = sesBaglaminiAl();
        if (sesCtx && sesCtx.state === 'running') {
          evrimGosterildi[isim] = asama;
          kaydetEvrimGosterildi();
          setTimeout(() => hayvanSesiCal(evcilHayvanlar[isim], asama), 300);
        }
      }

      hayvanHtml = `
        <div class="hayvanKart ${efsaneMi ? 'efsanevi' : ''}">
          <div class="hayvanEmoji hayvanAsama${asama} tiklanabilir ${efsaneMi && ['kedi', 'kurt', 'kus'].includes(evcilHayvanlar[isim]) ? 'hayvanResimli' : ''}" data-tur="${evcilHayvanlar[isim]}" data-asama="${asama}" title="Dokun, dostunla oyna!">${efsaneMi && evcilHayvanlar[isim] === 'kedi' ? '<img src="images/efsanevi-altin-aslan.svg" alt="Efsanevi Altın Kanatlı Aslan" class="hayvanKarakterResmi">' : efsaneMi && evcilHayvanlar[isim] === 'kurt' ? '<img src="images/efsanevi-ay-kurdu.svg" alt="Efsanevi Ay Kurdu" class="hayvanKarakterResmi">' : efsaneMi && evcilHayvanlar[isim] === 'kus' ? '<img src="images/efsanevi-anka-kusu.svg" alt="Efsanevi Anka Kuşu" class="hayvanKarakterResmi">' : mevcut.emoji}</div>
          <div class="hayvanAd">${escapeHtml(mevcut.ad)}</div>
          <button class="hayvanSesBtn" data-tur="${evcilHayvanlar[isim]}" data-asama="${asama}">🔊 Sesini Dinle</button>

          ${sonrakiEsik !== undefined
            ? `<div class="hayvanIlerleme"><div class="hayvanIlerlemeDolu" style="width:${Math.min(100, Math.round(((tamamlananSayisi - oncekiEsik) / (sonrakiEsik - oncekiEsik)) * 100))}%"></div></div>
               <div class="hayvanAlt">Sonraki evrime ${sonrakiEsik - tamamlananSayisi} kitap kaldı</div>`
            : `<div class="hayvanAlt">✨ En yüksek evrime ulaştı!</div>`}
        </div>`;
    }

    const gelisim = gelisimMesajiOlustur(isim);

    return `
      <div class="kisiKart">
        <div class="kisiKartUst">
          <h2>${escapeHtml(isim)}</h2>
          <button class="kisiSilBtn" data-isim="${escapeHtml(isim)}" title="Kaşifi Sil">✕</button>
        </div>
        <div class="rozet">${rozet.emoji} ${rozet.ad}</div>
        <div class="gelisimMesaji">${gelisim.emoji} ${gelisim.metin}</div>

        <div class="ucusPaneli">
          <div class="ucusYolu">
            ${gezegenler}
            <div class="roket" style="bottom:${roketKonumu}%">🚀</div>
          </div>
        </div>

        <div class="kisiIstatistik">
          <div><strong>${ist.toplamSayfa}</strong><span>Sayfa</span></div>
          <div><strong>${ist.tamamlanan.length}</strong><span>Kitap</span></div>
          <div><strong>${ist.gunSayisi}</strong><span>Gün</span></div>
        </div>

        <div class="rafBaslik">⭐ Toplanan Yıldızlar</div>
        <div class="yildizKutusu">${yildizlar || '<span class="rafBos">Henüz yıldız kazanılmadı</span>'}</div>

        <div class="rafBaslik">🏆 Kupa Dolabı (${kupaAdedi})</div>
        <div class="kupaKutusu">${kupaGosterim || `<span class="rafBos">İlk kupa için ${kupayaKalan} kitap daha!</span>`}</div>

        <div class="rafBaslik">🐾 Büyülü Dostun</div>
        ${hayvanHtml}
      </div>
    `;
  }).join('');
}

const kisiKartlariAlani = document.getElementById('kisiKartlari');
if (kisiKartlariAlani) {
  kisiKartlariAlani.addEventListener('click', e => {
    const silBtn = e.target.closest('.kisiSilBtn');
    const hayvanBtn = e.target.closest('.hayvanSecBtn');
    const sesBtn = e.target.closest('.hayvanSesBtn');
    const onizlemeBtn = e.target.closest('.hayvanOnizlemeBtn');
    const hayvanEmoji = e.target.closest('.hayvanEmoji');

    if (silBtn) kisiSil(silBtn.dataset.isim);
    if (hayvanBtn) evcilHayvanSec(hayvanBtn.dataset.isim, hayvanBtn.dataset.tur);
    if (sesBtn) hayvanSesiCal(sesBtn.dataset.tur, sesBtn.dataset.asama);
    if (onizlemeBtn) hayvanSesiCal(onizlemeBtn.dataset.tur, onizlemeBtn.dataset.asama);

    if (hayvanEmoji) {
      const dokunulanTur = hayvanEmoji.dataset.tur;
      hayvanSesiCal(dokunulanTur, hayvanEmoji.dataset.asama);
      hayvanEmoji.classList.remove('sevinc', 'kanatCirp');
      // Her dokunuşta animasyonu yeniden başlat.
      void hayvanEmoji.offsetWidth;
      hayvanEmoji.classList.add('sevinc');
      if (dokunulanTur === 'kus') hayvanEmoji.classList.add('kanatCirp');
      hayvanEmoji.addEventListener('animationend', function temizle(ev) {
        if (['hayvanSevinc', 'kanatCirpma'].includes(ev.animationName)) {
          if (ev.animationName === 'hayvanSevinc') hayvanEmoji.classList.remove('sevinc');
          if (ev.animationName === 'kanatCirpma') hayvanEmoji.classList.remove('kanatCirp');
          if (!hayvanEmoji.classList.contains('sevinc') && !hayvanEmoji.classList.contains('kanatCirp')) {
            hayvanEmoji.removeEventListener('animationend', temizle);
          }
        }
      });
    }
  });
}

// ------------------------------------------------------------
// GENEL İSTATİSTİKLER
// ------------------------------------------------------------
function genelIstatistikleriGuncelle() {
  const toplamSayfa = kayitlar.reduce((t, k) => t + Number(k.okunanSayfa || 0), 0);
  let toplamKitap = 0;
  let lider = '-';
  let enYuksek = -1;

  kisiler.forEach(isim => {
    const ist = kisiIstatistikleri(isim);
    toplamKitap += ist.tamamlanan.length;
    if (ist.toplamSayfa > enYuksek) {
      enYuksek = ist.toplamSayfa;
      lider = isim;
    }
  });

  document.getElementById('toplamSayfaGenel').innerText = toplamSayfa;
  document.getElementById('toplamKitapGenel').innerText = toplamKitap;
  document.getElementById('lider').innerText = kisiler.length ? lider : '-';
}

// ------------------------------------------------------------
// KAYDET / SİL / DÜZENLE
// ------------------------------------------------------------
const kaydetBtn = document.getElementById('kaydetBtn');
if (kaydetBtn) kaydetBtn.addEventListener('click', kaydet);

const iptalBtn = document.getElementById('iptalBtn');
if (iptalBtn) iptalBtn.addEventListener('click', duzenlemeyiIptalEt);

function kaydet() {
  const kisi = document.getElementById('kisi').value;
  const tarih = document.getElementById('tarih').value;
  const kitap = document.getElementById('kitapAdi').value.trim();
  const yazar = document.getElementById('yazar').value.trim();
  const toplamSayfa = Number(document.getElementById('toplamSayfa').value) || 0;
  const okunanSayfa = Number(document.getElementById('okunanSayfa').value) || 0;
  const dosyaInput = document.getElementById('kayitDosya');

  if (kisiler.length === 0) { alert('Önce bir okuyucu ekleyin.'); return; }
  if (kisi === '') { alert('Lütfen kişi seçiniz.'); return; }
  if (kitap === '') { alert('Kitap adı giriniz.'); return; }
  if (okunanSayfa <= 0) { alert('Okunan sayfa 0’dan büyük olmalıdır.'); return; }

  const tamamla = (dosya) => {
    const yeniKayit = { kisi, tarih, kitap, yazar, toplamSayfa, okunanSayfa };

    if (duzenlenenIndex >= 0) {
      if (!dosya && kayitlar[duzenlenenIndex] && kayitlar[duzenlenenIndex].dosya) {
        yeniKayit.dosya = kayitlar[duzenlenenIndex].dosya;
      } else if (dosya) {
        yeniKayit.dosya = dosya;
      }
      kayitlar[duzenlenenIndex] = yeniKayit;
      duzenlenenIndex = -1;
      kaydetBtn.innerText = '💾 Kaydı Ekle';
      if (iptalBtn) iptalBtn.style.display = 'none';
    } else {
      if (dosya) yeniKayit.dosya = dosya;
      kayitlar.push(yeniKayit);
    }

    kaydetVeri();
    formuTemizle();
    tumunuGuncelle();
  };

  if (dosyaInput && dosyaInput.files && dosyaInput.files[0]) {
    dosyaOku(dosyaInput.files[0], (dosya) => tamamla(dosya));
  } else {
    tamamla(null);
  }
}

function formuTemizle() {
  document.getElementById('kitapAdi').value = '';
  document.getElementById('yazar').value = '';
  document.getElementById('toplamSayfa').value = '';
  document.getElementById('okunanSayfa').value = '';
  const dosyaInput = document.getElementById('kayitDosya');
  if (dosyaInput) dosyaInput.value = '';
  bugununTarihiniAyarla();
}

let sonSilinenKayit = null;
let geriAlZamanlayici = null;

function sil(i) {
  if (!confirm('Bu kayıt silinsin mi? (Silindikten sonra birkaç saniye içinde "Geri Al" ile geri getirebilirsin)')) return;
  sonSilinenKayit = { kayit: kayitlar[i], index: i };
  kayitlar.splice(i, 1);
  kaydetVeri();
  tumunuGuncelle();
  geriAlToastGoster();
}

function geriAl() {
  if (!sonSilinenKayit) return;
  kayitlar.splice(sonSilinenKayit.index, 0, sonSilinenKayit.kayit);
  kaydetVeri();
  tumunuGuncelle();
  sonSilinenKayit = null;
  clearTimeout(geriAlZamanlayici);
  const toast = document.getElementById('geriAlToast');
  if (toast) toast.classList.remove('gorunur');
}

function geriAlToastGoster() {
  clearTimeout(geriAlZamanlayici);
  let toast = document.getElementById('geriAlToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'geriAlToast';
    toast.className = 'geriAlToast';
    toast.innerHTML = `<span>🗑️ Kayıt silindi.</span><button id="geriAlBtn" type="button">↩️ Geri Al</button>`;
    document.body.appendChild(toast);
    document.getElementById('geriAlBtn').addEventListener('click', geriAl);
  }
  // Yeniden tetiklenebilmesi için önce gizleyip bir sonraki karede tekrar gösteriyoruz.
  toast.classList.remove('gorunur');
  void toast.offsetWidth;
  toast.classList.add('gorunur');
  geriAlZamanlayici = setTimeout(() => {
    toast.classList.remove('gorunur');
    sonSilinenKayit = null;
  }, 6000);
}

function duzenle(i) {
  const k = kayitlar[i];
  if (!k) return;
  document.getElementById('kisi').value = k.kisi;
  document.getElementById('tarih').value = k.tarih;
  document.getElementById('kitapAdi').value = k.kitap;
  document.getElementById('yazar').value = k.yazar;
  document.getElementById('toplamSayfa').value = k.toplamSayfa;
  document.getElementById('okunanSayfa').value = k.okunanSayfa;

  duzenlenenIndex = i;
  kaydetBtn.innerText = '💾 Değişikliği Kaydet';
  if (iptalBtn) iptalBtn.style.display = 'inline-block';
  document.getElementById('kaydetBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function duzenlemeyiIptalEt() {
  duzenlenenIndex = -1;
  formuTemizle();
  kaydetBtn.innerText = '💾 Kaydı Ekle';
  if (iptalBtn) iptalBtn.style.display = 'none';
}

// ------------------------------------------------------------
// GÜNLÜK KAYITLAR TABLOSU (tarihe göre sıralı, en yeni üstte)
// ------------------------------------------------------------
function kayitlariGoster() {
  const body = document.getElementById('kayitlarBody');
  if (!body) return;

  if (kayitlar.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="bosDurum">Henüz kayıt yok. Yukarıdan yeni bir okuma kaydı ekleyin.</td></tr>`;
    return;
  }

  const sirali = kayitlar
    .map((k, i) => ({ k, i }))
    .sort((a, b) => (b.k.tarih || '').localeCompare(a.k.tarih || ''));

  body.innerHTML = sirali.map(({ k, i }) => `
    <tr>
      <td>${formatTarih(k.tarih)}</td>
      <td>${escapeHtml(k.kisi)}</td>
      <td>${escapeHtml(k.kitap)}</td>
      <td>${escapeHtml(k.yazar || '-')}</td>
      <td>${k.okunanSayfa}</td>
      <td>${k.dosya ? `<button class="dosyaMiniBtn" data-index="${i}" title="${escapeHtml(k.dosya.ad)}">📎</button>` : '-'}</td>
      <td>
        <button class="duzenleBtn" data-index="${i}" title="Düzenle">✏️</button>
        <button class="silBtn" data-index="${i}" title="Sil">🗑️</button>
      </td>
    </tr>
  `).join('');
}

const kayitlarBody = document.getElementById('kayitlarBody');
if (kayitlarBody) {
  kayitlarBody.addEventListener('click', e => {
    const d = e.target.closest('.duzenleBtn');
    const s = e.target.closest('.silBtn');
    const f = e.target.closest('.dosyaMiniBtn');
    if (d) duzenle(Number(d.dataset.index));
    if (s) sil(Number(s.dataset.index));
    if (f) dosyaIndir(kayitlar[Number(f.dataset.index)].dosya);
  });
}

// ------------------------------------------------------------
// DEVAM EDEN KİTAPLAR (ilerleme çubukları — en çok tamamlanana yakın olan üstte)
// ------------------------------------------------------------
function devamEdenKitaplariGoster() {
  const alan = document.getElementById('devamEdenKitaplar');
  if (!alan) return;

  let liste = [];
  kisiler.forEach(isim => {
    const ist = kisiIstatistikleri(isim);
    ist.devamEden.forEach(kt => {
      const yuzde = kt.toplamSayfa > 0 ? Math.min(100, Math.round((kt.okunan / kt.toplamSayfa) * 100)) : 0;
      liste.push({ isim, ...kt, yuzde });
    });
  });
  liste.sort((a, b) => b.yuzde - a.yuzde);

  if (liste.length === 0) {
    alan.innerHTML = '<p class="bosDurum">🛰️ Devam eden görev yok — yeni bir maceraya başlamaya ne dersin?</p>';
    return;
  }

  alan.innerHTML = liste.map(kt => `
    <div class="devamKart">
      <div class="devamBaslik">
        <span class="devamKisi">🧑‍🚀 ${escapeHtml(kt.isim)}</span>
        <span class="devamKitap">${escapeHtml(kt.kitap)}</span>
      </div>
      <div class="ilerlemeCubugu">
        <div class="ilerlemeDolu" style="width:${kt.yuzde}%"></div>
      </div>
      <div class="devamAlt">
        <span>${kt.okunan} / ${kt.toplamSayfa || '?'} sayfa</span>
        <span>%${kt.yuzde} yakıt</span>
      </div>
    </div>
  `).join('');
}

// ------------------------------------------------------------
// KİTAP ARŞİVİ (alfabetik sıralı, tamamlanma durumu ile)
// ------------------------------------------------------------
function kitapArsiviniGoster() {
  const arsivBody = document.getElementById('arsivBody');
  if (!arsivBody) return;

  let tumKitaplar = [];
  kisiler.forEach(isim => {
    const ist = kisiIstatistikleri(isim);
    ist.kitaplar.forEach(kt => {
      const tamam = kt.toplamSayfa > 0 && kt.okunan >= kt.toplamSayfa;
      tumKitaplar.push({ isim, ...kt, tamam });
    });
  });

  tumKitaplar.sort((a, b) => a.kitap.localeCompare(b.kitap, 'tr'));

  if (tumKitaplar.length === 0) {
    arsivBody.innerHTML = `<tr><td colspan="5" class="bosDurum">Arşivde henüz kitap yok.</td></tr>`;
    return;
  }

  arsivBody.innerHTML = tumKitaplar.map(kt => `
    <tr>
      <td>${escapeHtml(kt.kitap)}</td>
      <td>${escapeHtml(kt.yazar || '-')}</td>
      <td>${escapeHtml(kt.isim)}</td>
      <td>${kt.okunan} / ${kt.toplamSayfa || '?'}</td>
      <td>${kt.tamam ? '<span class="durumRozeti tamam">✅ Tamamlandı</span>' : '<span class="durumRozeti devam">📖 Devam Ediyor</span>'}</td>
    </tr>
  `).join('');
}

// ------------------------------------------------------------
// GRAFİK
// ------------------------------------------------------------
function grafikGuncelle() {
  const ctx = document.getElementById('okumaGrafik');
  if (!ctx) return;
  if (grafik) grafik.destroy();

  grafik = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: kisiler,
      datasets: [{
        label: 'Okunan Sayfa',
        data: kisiler.map(isim => kisiIstatistikleri(isim).toplamSayfa),
        backgroundColor: kisiler.map((_, i) => RENKLER[i % RENKLER.length]),
        borderRadius: 8,
        maxBarThickness: 60
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

// ------------------------------------------------------------
// GELİŞİM GRAFİĞİ (zaman içinde kümülatif sayfa — kaşif başına çizgi)
// ------------------------------------------------------------
function gelisimVerisiHazirla() {
  const tarihSet = new Set(kayitlar.map(k => k.tarih).filter(Boolean));
  const tarihler = Array.from(tarihSet).sort();

  const seriler = kisiler.map((isim, i) => {
    let kumulatif = 0;
    const veri = tarihler.map(tarih => {
      kumulatif += kayitlar
        .filter(k => k.kisi === isim && k.tarih === tarih)
        .reduce((t, k) => t + Number(k.okunanSayfa || 0), 0);
      return kumulatif;
    });
    return {
      label: isim,
      data: veri,
      borderColor: RENKLER[i % RENKLER.length],
      backgroundColor: RENKLER[i % RENKLER.length] + '33',
      tension: 0.35,
      fill: false,
      pointRadius: 3,
    };
  });

  return { tarihler, seriler };
}

function gelisimGrafikGuncelle() {
  const ctx = document.getElementById('gelisimGrafik');
  const bosMesaj = document.getElementById('gelisimGrafikBos');
  if (!ctx) return;
  if (gelisimGrafik) gelisimGrafik.destroy();

  const { tarihler, seriler } = gelisimVerisiHazirla();

  if (tarihler.length < 2 || kisiler.length === 0) {
    ctx.style.display = 'none';
    if (bosMesaj) bosMesaj.style.display = 'block';
    return;
  }

  ctx.style.display = 'block';
  if (bosMesaj) bosMesaj.style.display = 'none';

  gelisimGrafik = new Chart(ctx, {
    type: 'line',
    data: { labels: tarihler.map(formatTarih), datasets: seriler },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 12 } } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Toplam Sayfa' } } }
    }
  });
}

// ------------------------------------------------------------
// ÖDÜLLER REHBERİ (tüm ödüller ve nasıl kazanıldıkları)
// ------------------------------------------------------------
function odullerRehberiniGoster() {
  const alan = document.getElementById('odullerRehberi');
  if (!alan) return;

  const rozetSatirlari = KILOMETRE_TASLARI.map(k => `
    <div class="oduTanim">
      <span class="oduEmoji">${k.emoji}</span>
      <div><strong>${escapeHtml(k.ad)}</strong><span>Toplamda ${k.sinir}+ sayfa okuyunca kazanılır</span></div>
    </div>
  `).join('');

  const hayvanBlok = Object.values(HAYVAN_TURLERI).map(tur => `
    <div class="oduHayvanAile">
      <strong>${escapeHtml(tur.ad)}</strong>
      <div class="oduHayvanZinciri">
        ${tur.asamalar.map((a, i) => `
          <div class="oduHayvanAsama">
            <span class="oduHayvanEmoji">${a.emoji}</span>
            <span>${escapeHtml(a.ad)}</span>
            <small>${EVRIM_ESIKLERI[i]}+ kitap</small>
          </div>
          ${i < tur.asamalar.length - 1 ? '<span class="oduOk">→</span>' : ''}
        `).join('')}
      </div>
    </div>
  `).join('');

  alan.innerHTML = `
    <h3 class="oduBaslik">🌟 Kaşif Rozetleri <span class="oduAltbilgi">(toplam okunan sayfaya göre)</span></h3>
    <div class="oduListesi">${rozetSatirlari}</div>

    <h3 class="oduBaslik">🏆 Kupa Dolabı</h3>
    <div class="oduTanim">
      <span class="oduEmoji">🏆</span>
      <div><strong>Okuma Kupası</strong><span>Her ${KUPA_ARALIGI} tamamlanan kitapta 1 kupa kazanılır. Kupa sayısı sınırsız artar!</span></div>
    </div>

    <h3 class="oduBaslik">🐾 Büyülü Dost</h3>
    <p class="oduAciklama">${EVRIM_ESIKLERI[0]} kitap tamamlayınca bir büyülü dost seçilir: Kedi, Kertenkele, Kurt, Kuş veya Balık. Her ${EVRIM_ESIKLERI[0]} kitapta bir üst forma evrim geçirir. Her hayvanın kendine özgü bir sesi var — 🔊 düğmesine basarak dinleyebilirsin:</p>
    <div class="oduHayvanListesi">${hayvanBlok}</div>

    <h3 class="oduBaslik">📈 Gelişim Mesajları</h3>
    <div class="oduTanim">
      <span class="oduEmoji">⭐</span>
      <div><strong>Haftalık Karşılaştırma</strong><span>Her kaşifin kartında, bu haftaki okuması geçen haftayla karşılaştırılıp teşvik edici bir mesaj gösterilir.</span></div>
    </div>
  `;
}

// ------------------------------------------------------------
// DOSYA İŞLEMLERİ (kayda ek dosya + genel dosya arşivi)
// PDF ve Excel dosyaları base64 olarak tarayıcıda (localStorage) saklanır.
// ------------------------------------------------------------
const IZIN_VERILEN_UZANTILAR = ['pdf', 'xlsx', 'xls'];
const MAKS_DOSYA_BOYUTU = 4 * 1024 * 1024; // 4MB

function dosyaOku(file, callback) {
  const uzanti = file.name.split('.').pop().toLowerCase();

  if (!IZIN_VERILEN_UZANTILAR.includes(uzanti)) {
    alert('Sadece PDF ve Excel (.xlsx, .xls) dosyaları eklenebilir.');
    callback(null);
    return;
  }
  if (file.size > MAKS_DOSYA_BOYUTU) {
    alert('Dosya çok büyük (4MB üzeri). Daha küçük bir dosya seçin.');
    callback(null);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => callback({ ad: file.name, tur: uzanti, boyut: file.size, tarih: new Date().toISOString(), veri: reader.result });
  reader.onerror = () => { alert('Dosya okunamadı.'); callback(null); };
  reader.readAsDataURL(file);
}

function dosyaIndir(dosya) {
  if (!dosya) return;
  const a = document.createElement('a');
  a.href = dosya.veri;
  a.download = dosya.ad;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Genel Dosya Arşivi
const dosyaArsivInput = document.getElementById('dosyaArsivInput');
if (dosyaArsivInput) {
  dosyaArsivInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;
    dosyaOku(file, (dosya) => {
      if (!dosya) { event.target.value = ''; return; }
      dosyaArsivi.push({ id: Date.now(), ...dosya });
      kaydetDosyaArsivi();
      dosyaArsiviniGoster();
      event.target.value = '';
    });
  });
}

function dosyaArsivindenSil(id) {
  if (!confirm('Bu dosya arşivden silinsin mi?')) return;
  dosyaArsivi = dosyaArsivi.filter(d => d.id !== id);
  kaydetDosyaArsivi();
  dosyaArsiviniGoster();
}

function dosyaArsiviniGoster() {
  const alan = document.getElementById('dosyaArsiviListesi');
  if (!alan) return;

  if (dosyaArsivi.length === 0) {
    alan.innerHTML = '<p class="bosDurum">📁 Arşivde henüz dosya yok. PDF veya Excel dosyası ekleyerek başlayın.</p>';
    return;
  }

  alan.innerHTML = dosyaArsivi.map(d => `
    <div class="dosyaKart">
      <span class="dosyaIkon">${d.tur === 'pdf' ? '📄' : '📊'}</span>
      <div class="dosyaBilgi">
        <strong>${escapeHtml(d.ad)}</strong>
        <span>${boyutFormatla(d.boyut)} · ${new Date(d.tarih).toLocaleDateString('tr-TR')}</span>
      </div>
      <button class="dosyaIndirBtn2" data-id="${d.id}" title="İndir">⬇️</button>
      <button class="dosyaSilBtn" data-id="${d.id}" title="Sil">🗑️</button>
    </div>
  `).join('');
}

const dosyaArsiviListesi = document.getElementById('dosyaArsiviListesi');
if (dosyaArsiviListesi) {
  dosyaArsiviListesi.addEventListener('click', e => {
    const indirBtn = e.target.closest('.dosyaIndirBtn2');
    const silBtn = e.target.closest('.dosyaSilBtn');
    if (indirBtn) {
      const d = dosyaArsivi.find(x => x.id === Number(indirBtn.dataset.id));
      dosyaIndir(d);
    }
    if (silBtn) dosyaArsivindenSil(Number(silBtn.dataset.id));
  });
}

// ------------------------------------------------------------
// EXCEL DIŞA / İÇE AKTARMA
// ------------------------------------------------------------
const excelAktarBtn = document.getElementById('excelAktarBtn');
if (excelAktarBtn) excelAktarBtn.addEventListener('click', excelAktar);

function excelAktar() {
  if (kayitlar.length === 0) { alert('Aktarılacak kayıt yok.'); return; }
  const secim = document.getElementById('excelKisiSecimi');
  const isim = secim ? secim.value : '';
  if (!isim) { alert('Excel indirmek için önce okuyucu seç.'); return; }
  const kisiKayitlari = kayitlar.filter(k => k.kisi === isim);
  if (kisiKayitlari.length === 0) { alert(isim + ' için kayıt bulunamadı.'); return; }
  const veri = kisiKayitlari.map(k => ({
    Tarih: k.tarih, Kisi: k.kisi, Kitap: k.kitap, Yazar: k.yazar,
    OkunanSayfa: k.okunanSayfa, ToplamSayfa: k.toplamSayfa
  }));
  const ws = XLSX.utils.json_to_sheet(veri);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Kitaplar');
  const guvenliAd = isim.replace(/[\\/:*?"<>|]/g, '_').trim();
  XLSX.writeFile(wb, `KitapTakip_${guvenliAd}_${bugunYYYYMMDD()}.xlsx`);
}

const excelDosyaInput = document.getElementById('excelDosya');
if (excelDosyaInput) excelDosyaInput.addEventListener('change', excelYukle);

function excelYukle(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const satirlar = XLSX.utils.sheet_to_json(sheet);
      let eklenen = 0;

      satirlar.forEach(satir => {
        const kisiHam = String(satir.Kisi || satir.kisi || '').trim();
        const kitap = String(satir.Kitap || satir.kitap || '').trim();
        if (!kisiHam || !kitap) return;

        const mevcut = kisiler.find(k => k.trim().toLocaleLowerCase('tr') === kisiHam.toLocaleLowerCase('tr'));
        const kisi = mevcut || kisiHam;
        if (!mevcut) kisiler.push(kisiHam);

        kayitlar.push({
          kisi,
          tarih: String(satir.Tarih || satir.tarih || ''),
          kitap,
          yazar: String(satir.Yazar || satir.yazar || ''),
          toplamSayfa: Number(satir.ToplamSayfa || satir.toplamSayfa || 0),
          okunanSayfa: Number(satir.OkunanSayfa || satir.okunanSayfa || 0),
        });
        eklenen++;
      });

      kaydetVeri();
      tumunuGuncelle();
      alert(`✅ ${eklenen} kayıt başarıyla içe aktarıldı.`);
    } catch (err) {
      alert('Excel dosyası okunamadı. Lütfen dosya formatını kontrol edin.');
    }
    event.target.value = '';
  };
  reader.readAsArrayBuffer(file);
}

// ------------------------------------------------------------
// PDF RAPORU
// ------------------------------------------------------------
const pdfBtn = document.getElementById("pdfBtn");
if (pdfBtn) pdfBtn.addEventListener("click", pdfOlustur);

function pdfOlustur() {
  const { jsPDF } = window.jspdf;
  const okuyucular = kisiler.filter(isim => kayitlar.some(k => k.kisi === isim));
  if (okuyucular.length === 0) { alert('PDF’e aktarılacak okuyucu kaydı yok.'); return; }

  okuyucular.forEach((isim, index) => {
    const pdf = new jsPDF();
    const ist = kisiIstatistikleri(isim);

    pdf.setFontSize(20);
    pdf.text("Kitap Takip Raporu - " + isim, 20, 20);
    pdf.setFontSize(10);
    pdf.text("Olusturulma Tarihi: " + new Date().toLocaleDateString('tr-TR'), 20, 27);

    let y = 40;
    pdf.setFontSize(14);
    pdf.text(`${isim} - ${ist.tamamlanan.length} kitap, ${ist.toplamSayfa} sayfa`, 20, y);
    y += 10;
    pdf.setFontSize(10);

    ist.kitaplar.forEach(kt => {
      const durum = (kt.toplamSayfa > 0 && kt.okunan >= kt.toplamSayfa) ? 'Tamamlandi' : 'Devam Ediyor';
      const satir = `- ${kt.kitap} (${kt.yazar || '-'}) - ${kt.okunan}/${kt.toplamSayfa || '?'} - ${durum}`;
      const satirlar = pdf.splitTextToSize(satir, 170);
      pdf.text(satirlar, 22, y);
      y += satirlar.length * 5 + 2;
      if (y > 280) { pdf.addPage(); y = 20; }
    });

    const guvenliAd = isim.replace(/[\\/:*?"<>|]/g, '_').trim();
    setTimeout(() => pdf.save(`KitapTakipRaporu_${guvenliAd}_${bugunYYYYMMDD()}.pdf`), index * 700);
  });

  alert('Her okuyucu için ayrı PDF dosyası hazırlanıyor. Tarayıcı birden fazla indirmeye izin isterse onaylayın.');
}

// ------------------------------------------------------------
// TÜMÜNÜ GÜNCELLE (ana yenileme fonksiyonu)
// ------------------------------------------------------------
function tumunuGuncelle() {
  kisiListesiniGuncelle();
  kisiKartlariniOlustur();
  genelIstatistikleriGuncelle();
  kayitlariGoster();
  devamEdenKitaplariGoster();
  kitapArsiviniGoster();
  grafikGuncelle();
  gelisimGrafikGuncelle();
  dosyaArsiviniGoster();
  odullerRehberiniGoster();
}

// ============================================================
// ============================================================
// ANA SEKMELER (Panom / Kaşifler / Uçuş Günlüğü / Yıldız Kütüphanesi /
// Kargo Ambarı / Ödüller) — sayfayı derli toplu tutmak için
// tüm bölümler artık sekme sekme açılıyor, hepsi aynı anda alt alta
// durmuyor.
// ============================================================
function anaSekmesiGoster(sekme) {
  document.querySelectorAll('.anaSekmeBtn').forEach(b => b.classList.toggle('aktif', b.dataset.anasekme === sekme));
  document.querySelectorAll('.anaSekmeIcerik').forEach(i => {
    i.style.display = i.id === `anasekme-${sekme}` ? 'block' : 'none';
  });
}

document.querySelectorAll('.anaSekmeBtn').forEach(btn => {
  btn.addEventListener('click', () => anaSekmesiGoster(btn.dataset.anasekme));
});
