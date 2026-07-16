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
      { ad: 'Efsanevi Gökkuşağı Ejderhası', emoji: '🐉' },
    ],
  },
  kurt: {
    ad: 'Kurt Ailesi',
    asamalar: [
      { ad: 'Kurt Yavrusu', emoji: '🐺' },
      { ad: 'Genç Kurt', emoji: '🐺' },
      { ad: 'Kutup Kurdu', emoji: '🐺' },
      { ad: 'Efsanevi Ay Kurdu', emoji: '🌕' },
    ],
  },
  kus: {
    ad: 'Kuş Ailesi',
    asamalar: [
      { ad: 'Yavru Kuş', emoji: '🐣' },
      { ad: 'Genç Şahin', emoji: '🦅' },
      { ad: 'Kartal', emoji: '🦅' },
      { ad: 'Efsanevi Anka Kuşu', emoji: '🔥' },
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
    const taban = 900 + asama * 110;
    tonCal(taban, 0.08, 'triangle', 0, 0.18);
    tonCal(taban * 1.2, 0.08, 'triangle', 0.09, 0.18);
    tonCal(taban * 1.4, 0.1, 'triangle', 0.18, 0.18);
  },
  balik: (asama) => {
    for (let i = 0; i < 3; i++) tonCal(700 + Math.random() * 300 + asama * 60, 0.08, 'sine', i * 0.09, 0.15);
  },
};

function hayvanSesiCal(tur, asama) {
  const fn = HAYVAN_SESLERI[tur];
  if (fn) fn(Math.max(0, Number(asama) || 0));
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
  if (kisiler.includes(ad)) { alert('Bu kişi zaten kayıtlı.'); return; }

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
}

// ------------------------------------------------------------
// İSTATİSTİK HESAPLAMA (kaynak: kayıtlar, tek yerden hesaplanır)
// ------------------------------------------------------------
function kisiIstatistikleri(isim) {
  const kayitlarim = kayitlar.filter(k => k.kisi === isim);
  const toplamSayfa = kayitlarim.reduce((t, k) => t + Number(k.okunanSayfa || 0), 0);

  const kitaplarMap = {};
  kayitlarim.forEach(k => {
    const anahtar = k.kitap;
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

      // Yeni bir evrim aşamasına ilk kez ulaşıldığında kutlama sesi çal
      if ((evrimGosterildi[isim] ?? -1) < asama) {
        evrimGosterildi[isim] = asama;
        kaydetEvrimGosterildi();
        setTimeout(() => hayvanSesiCal(evcilHayvanlar[isim], asama), 300);
      }

      hayvanHtml = `
        <div class="hayvanKart ${efsaneMi ? 'efsanevi' : ''}">
          <div class="hayvanEmoji hayvanAsama${asama} tiklanabilir" data-tur="${evcilHayvanlar[isim]}" data-asama="${asama}" title="Dokun, dostunla oyna!">${mevcut.emoji}</div>
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
      hayvanSesiCal(hayvanEmoji.dataset.tur, hayvanEmoji.dataset.asama);
      hayvanEmoji.classList.remove('sevinc');
      // Yeniden başlatmak için bir sonraki karede tekrar ekle (aynı animasyon üst üste tetiklenebilsin diye)
      void hayvanEmoji.offsetWidth;
      hayvanEmoji.classList.add('sevinc');
      hayvanEmoji.addEventListener('animationend', function temizle(ev) {
        if (ev.animationName === 'hayvanSevinc') {
          hayvanEmoji.classList.remove('sevinc');
          hayvanEmoji.removeEventListener('animationend', temizle);
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

  const veri = kayitlar.map(k => ({
    Tarih: k.tarih,
    Kisi: k.kisi,
    Kitap: k.kitap,
    Yazar: k.yazar,
    OkunanSayfa: k.okunanSayfa,
    ToplamSayfa: k.toplamSayfa
  }));

  const ws = XLSX.utils.json_to_sheet(veri);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Kitaplar");
  XLSX.writeFile(wb, `KitapTakip_${bugunYYYYMMDD()}.xlsx`);
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
        const kisi = String(satir.Kisi || satir.kisi || '').trim();
        const kitap = String(satir.Kitap || satir.kitap || '').trim();
        if (!kisi || !kitap) return;

        if (!kisiler.includes(kisi)) kisiler.push(kisi);

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
  const pdf = new jsPDF();

  pdf.setFontSize(20);
  pdf.text("Kitap Takip Pro Raporu", 20, 20);
  pdf.setFontSize(10);
  pdf.text("Olusturulma Tarihi: " + new Date().toLocaleDateString('tr-TR'), 20, 27);

  let y = 40;

  if (kisiler.length === 0) {
    pdf.setFontSize(12);
    pdf.text("Henuz kayitli okuyucu yok.", 20, y);
  }

  kisiler.forEach(isim => {
    const ist = kisiIstatistikleri(isim);
    pdf.setFontSize(14);
    pdf.text(`${isim} - ${ist.tamamlanan.length} kitap, ${ist.toplamSayfa} sayfa`, 20, y);
    y += 8;
    pdf.setFontSize(10);

    ist.kitaplar.forEach(kt => {
      const durum = (kt.toplamSayfa > 0 && kt.okunan >= kt.toplamSayfa) ? 'Tamamlandi' : 'Devam Ediyor';
      const satir = `  - ${kt.kitap} (${kt.yazar || '-'}) - ${kt.okunan}/${kt.toplamSayfa || '?'} - ${durum}`;
      pdf.text(satir, 22, y);
      y += 6;
      if (y > 280) { pdf.addPage(); y = 20; }
    });

    y += 6;
    if (y > 270) { pdf.addPage(); y = 20; }
  });

  pdf.save(`KitapTakipRaporu_${bugunYYYYMMDD()}.pdf`);
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
// ÇOCUK DÜNYA ATLASI
// Statik, eğitici içerik — okuma takibinden bağımsız ayrı bir bölüm.
// Görseller telif/ağ bağımlılığı olmaması için büyük emoji ile temsil
// edilir (offline çalışma prensibiyle uyumlu).
// Yeni ülke/bilgi eklemek için sadece aşağıdaki dizilere yeni bir
// nesne eklemek yeterlidir — arayüz otomatik güncellenir.
// ============================================================
const ULKELER = [
  {
    bayrak: '🇹🇷', ad: 'Türkiye', baskent: 'Ankara', kita: 'Asya / Avrupa', gorsel: '🎈',
    mekan: { ad: 'Kapadokya', bilgi: 'Peribacaları denen ilginç kaya oluşumlarıyla ünlüdür, sıcak hava balonlarıyla gökyüzünden izlenir.' },
    hayvan: { emoji: '🐈', ad: 'Van Kedisi', bilgi: 'Genelde bir gözü mavi bir gözü sarı/yeşil olur ve suda yüzmeyi seven nadir kedilerdendir.' },
    bilgiNotu: 'Türkiye, Asya ile Avrupa\'yı birbirine bağlayan İstanbul Boğazı\'na sahip tek ülkedir!',
  },
  {
    bayrak: '🇫🇷', ad: 'Fransa', baskent: 'Paris', kita: 'Avrupa', gorsel: '🗼',
    mekan: { ad: 'Eyfel Kulesi', bilgi: 'Yaklaşık 330 metre yüksekliğindedir ve sıcak havada demir genleştiği için birkaç santim uzayabilir.' },
    hayvan: { emoji: '🐓', ad: 'Galya Horozu', bilgi: 'Fransa\'nın milli sembolüdür, gururlu duruşuyla bilinir.' },
    bilgiNotu: 'Fransa\'da 1000\'den fazla çeşit peynir üretilir!',
  },
  {
    bayrak: '🇪🇬', ad: 'Mısır', baskent: 'Kahire', kita: 'Afrika', gorsel: '🔺',
    mekan: { ad: 'Giza Piramitleri', bilgi: 'Binlerce yıl önce, hiç modern makine yokken dev taş bloklarla inşa edilmiştir.' },
    hayvan: { emoji: '🐫', ad: 'Deve', bilgi: 'Hörgücünde yağ depolar ve susuz günlerce çölde yolculuk edebilir.' },
    bilgiNotu: 'Nil Nehri, dünyanın en uzun nehirlerinden biridir ve Mısır\'ın can damarıdır.',
  },
  {
    bayrak: '🇨🇳', ad: 'Çin', baskent: 'Pekin', kita: 'Asya', gorsel: '🧱',
    mekan: { ad: 'Çin Seddi', bilgi: 'Uzunluğu binlerce kilometredir; bazı bölümleri uzaydan bile fark edilebilir denir (aslında çok da net görülmez, ama efsanesi böyledir!).' },
    hayvan: { emoji: '🐼', ad: 'Dev Panda', bilgi: 'Günde neredeyse 12 saat bambu yiyerek geçirir.' },
    bilgiNotu: 'Çin\'de kağıt, pusula ve barut gibi birçok önemli buluş binlerce yıl önce yapılmıştır.',
  },
  {
    bayrak: '🇯🇵', ad: 'Japonya', baskent: 'Tokyo', kita: 'Asya', gorsel: '🗻',
    mekan: { ad: 'Fuji Dağı', bilgi: 'Japonya\'nın en yüksek dağıdır ve kar kaplı zirvesiyle sanat eserlerine ilham vermiştir.' },
    hayvan: { emoji: '🐒', ad: 'Kar Maymunu', bilgi: 'Kışın kar altında sıcak kaplıcalara girerek ısınır.' },
    bilgiNotu: 'Japonya\'da ilkbaharda kiraz çiçeklerini (sakura) izlemek için özel şenlikler düzenlenir.',
  },
  {
    bayrak: '🇦🇺', ad: 'Avustralya', baskent: 'Canberra', kita: 'Okyanusya', gorsel: '🪨',
    mekan: { ad: 'Ayers Rock (Uluru)', bilgi: 'Dünyanın en büyük tek kaya parçalarından biridir ve gün batımında rengi kızıla döner.' },
    hayvan: { emoji: '🦘', ad: 'Kanguru', bilgi: 'Yavrularını karnındaki kesede taşır ve saatte 70 km hıza kadar zıplayabilir.' },
    bilgiNotu: 'Avustralya, hem bir ülke hem de bir kıtadır!',
  },
  {
    bayrak: '🇰🇪', ad: 'Kenya', baskent: 'Nairobi', kita: 'Afrika', gorsel: '🌅',
    mekan: { ad: 'Masai Mara', bilgi: 'Her yıl milyonlarca gnu ve zebranın yer değiştirdiği büyük göç bu bölgede yaşanır.' },
    hayvan: { emoji: '🦁', ad: 'Aslan', bilgi: 'Sürü halinde (aslan sürüsüne "gurur" denir) yaşayan tek büyük kedi türüdür.' },
    bilgiNotu: 'Kenya\'da dünyanın en hızlı kara hayvanı olan çita da yaşar.',
  },
  {
    bayrak: '🇧🇷', ad: 'Brezilya', baskent: 'Brasília', kita: 'Güney Amerika', gorsel: '🌳',
    mekan: { ad: 'Amazon Ormanları', bilgi: 'Dünyanın oksijeninin büyük bir kısmını üretir, bu yüzden "Dünya\'nın Akciğerleri" olarak anılır.' },
    hayvan: { emoji: '🦜', ad: 'Toukan (Tukan Kuşu)', bilgi: 'Rengarenk ve kocaman gagasıyla tanınır, bu gaga aslında çok hafiftir.' },
    bilgiNotu: 'Amazon Nehri\'nde piranha ve pembe yunuslar gibi ilginç canlılar yaşar.',
  },
  {
    bayrak: '🇺🇸', ad: 'Amerika Birleşik Devletleri', baskent: 'Washington D.C.', kita: 'Kuzey Amerika', gorsel: '🗽',
    mekan: { ad: 'Büyük Kanyon', bilgi: 'Colorado Nehri\'nin milyonlarca yılda oyduğu devasa bir vadidir, bazı yerlerde 1,8 km derinliğindedir.' },
    hayvan: { emoji: '🦅', ad: 'Kel Kartal', bilgi: 'ABD\'nin milli sembolüdür ve gözleri insan gözünden çok daha keskindir.' },
    bilgiNotu: 'Özgürlük Heykeli, Fransa tarafından ABD\'ye hediye edilmiştir.',
  },
  {
    bayrak: '🇮🇹', ad: 'İtalya', baskent: 'Roma', kita: 'Avrupa', gorsel: '🏛️',
    mekan: { ad: 'Kolezyum', bilgi: 'Antik Roma\'da binlerce kişinin gösterileri izlediği dev bir arenadır.' },
    hayvan: { emoji: '🐺', ad: 'Kurt', bilgi: 'Efsaneye göre Roma şehrinin kurucuları bir dişi kurt tarafından büyütülmüştür.' },
    bilgiNotu: 'Pizza ve makarna dünyaya İtalya\'dan yayılmıştır.',
  },
  {
    bayrak: '🇮🇳', ad: 'Hindistan', baskent: 'Yeni Delhi', kita: 'Asya', gorsel: '🕌',
    mekan: { ad: 'Tac Mahal', bilgi: 'Bir hükümdarın eşinin anısına inşa ettirdiği, beyaz mermerden yapılmış muhteşem bir anıt mezardır.' },
    hayvan: { emoji: '🐅', ad: 'Bengal Kaplanı', bilgi: 'Her kaplanın çizgileri parmak izi gibi kendine özgüdür, hiçbiri birbirinin aynısı değildir.' },
    bilgiNotu: 'Satranç oyunu ilk olarak Hindistan\'da ortaya çıkmıştır.',
  },
  {
    bayrak: '🐧', ad: 'Antarktika', baskent: 'Sabit yerleşim yok', kita: 'Antarktika (kıta)', gorsel: '🧊',
    mekan: { ad: 'Buzul Kıtası', bilgi: 'Dünyanın en soğuk, en rüzgarlı ve en kurak kıtasıdır; buzu bazı yerlerde 4 km kalınlığa ulaşır.' },
    hayvan: { emoji: '🐧', ad: 'İmparator Penguen', bilgi: 'Uçamaz ama harika yüzücüdür ve yumurtasını babası ayaklarının üzerinde aylarca ısıtır.' },
    bilgiNotu: 'Antarktika\'da hiç sürekli yaşayan insan nüfusu yoktur, sadece bilim insanları geçici olarak kalır.',
  },
];

const BILIM_DUNYASI = {
  uzay: {
    aciklama: 'Gökyüzünün ötesinde neler var, hep merak edilir. İşte uzay hakkında bilmen gereken bazı harika bilgiler!',
    kartlar: [
      { gorsel: '☀️', baslik: 'Güneş', bilgi: 'Güneş aslında dev bir yıldızdır! İçine 1 milyondan fazla Dünya sığabilir.' },
      { gorsel: '🌕', baslik: 'Ay', bilgi: 'Ay, Dünya\'nın etrafında yaklaşık 27 günde bir tur atar ve kendi ışığı yoktur, Güneş ışığını yansıtır.' },
      { gorsel: '🪐', baslik: 'Satürn', bilgi: 'Satürn\'ün etrafındaki halkalar aslında milyonlarca buz ve kaya parçasından oluşur.' },
      { gorsel: '🕳️', baslik: 'Kara Delik', bilgi: 'Kara delikler o kadar güçlü bir yer çekimine sahiptir ki ışık bile içinden kaçamaz!' },
      { gorsel: '👨‍🚀', baslik: 'Astronotlar', bilgi: 'Uzayda yer çekimi çok az olduğu için astronotlar havada süzülür, boyları bile birkaç santim uzayabilir.' },
      { gorsel: '⭐', baslik: 'Yıldızlar', bilgi: 'Gökyüzünde gördüğün birçok yıldız, Güneş\'ten çok daha büyük olabilir; sadece çok uzakta oldukları için küçük görünürler.' },
    ],
  },
  yeralti: {
    aciklama: 'Ayaklarımızın altında gizli bir dünya var! İşte yer altında neler olduğuna dair ilginç bilgiler.',
    kartlar: [
      { gorsel: '🕳️', baslik: 'Mağaralar', bilgi: 'Bazı mağaralar o kadar büyüktür ki içlerinde koca bir orman veya göl bile olabilir.' },
      { gorsel: '🌋', baslik: 'Volkanlar', bilgi: 'Yer altındaki erimiş kayalara magma denir; yeryüzüne çıktığında ona lav adı verilir.' },
      { gorsel: '🦴', baslik: 'Fosiller', bilgi: 'Fosiller, milyonlarca yıl önce yaşamış canlıların taşlaşmış izleridir ve bize dinozorlar hakkında bilgi verir.' },
      { gorsel: '🐛', baslik: 'Solucanlar', bilgi: 'Solucanlar toprağı kazarak havalandırır, bu da bitkilerin daha iyi büyümesine yardımcı olur.' },
      { gorsel: '💎', baslik: 'Değerli Taşlar', bilgi: 'Elmaslar, yer kabuğunun derinliklerinde yüksek basınç ve sıcaklık altında milyonlarca yılda oluşur.' },
      { gorsel: '🌍', baslik: 'Yer Katmanları', bilgi: 'Dünya\'nın en içindeki çekirdek katmanı, Güneş\'in yüzeyi kadar sıcak olabilir!' },
    ],
  },
  denizalti: {
    aciklama: 'Okyanusların derinliklerinde keşfedilmeyi bekleyen büyüleyici bir dünya var!',
    kartlar: [
      { gorsel: '🐋', baslik: 'Mavi Balina', bilgi: 'Mavi balina, gezegendeki en büyük canlıdır — dili bile bir filin ağırlığında olabilir!' },
      { gorsel: '🦑', baslik: 'Dev Kalamar', bilgi: 'Dev kalamarlar bir otobüs kadar uzun olabilir ve okyanusun karanlık derinliklerinde yaşarlar.' },
      { gorsel: '🐠', baslik: 'Mercan Resifleri', bilgi: 'Mercan resifleri aslında canlı organizmalardır ve binlerce deniz canlısına ev sahipliği yapar.' },
      { gorsel: '💡', baslik: 'Işıldayan Canlılar', bilgi: 'Bazı derin deniz canlıları kendi ışıklarını üretebilir; buna biyolüminesans denir.' },
      { gorsel: '🏔️', baslik: 'Mariana Çukuru', bilgi: 'Okyanusun en derin noktasıdır — Everest Dağı oraya konsa bile zirvesi su yüzeyine ulaşamazdı.' },
      { gorsel: '🐢', baslik: 'Deniz Kaplumbağaları', bilgi: 'Deniz kaplumbağaları yumurtlamak için doğdukları sahile geri döner; bu yolculuk binlerce kilometre olabilir.' },
    ],
  },
};

function ulkeleriGoster() {
  const alan = document.getElementById('atlas-ulkeler');
  if (!alan) return;

  alan.innerHTML = ULKELER.map(u => `
    <div class="ulkeKart">
      <div class="ulkeUst">
        <span class="ulkeGorsel">${u.gorsel}</span>
        <div>
          <h3>${u.bayrak} ${escapeHtml(u.ad)}</h3>
          <span class="ulkeAltbilgi">${escapeHtml(u.baskent)} · ${escapeHtml(u.kita)}</span>
        </div>
      </div>
      <div class="ulkeDetay">
        <div class="ulkeOzellik"><strong>📍 ${escapeHtml(u.mekan.ad)}</strong><span>${escapeHtml(u.mekan.bilgi)}</span></div>
        <div class="ulkeOzellik"><strong>${u.hayvan.emoji} ${escapeHtml(u.hayvan.ad)}</strong><span>${escapeHtml(u.hayvan.bilgi)}</span></div>
      </div>
      <div class="ulkeNot">💡 ${escapeHtml(u.bilgiNotu)}</div>
    </div>
  `).join('');
}

function bilimDunyasiniGoster() {
  Object.entries(BILIM_DUNYASI).forEach(([anahtar, bolum]) => {
    const alan = document.getElementById(`atlas-${anahtar}`);
    if (!alan) return;

    alan.innerHTML = `
      <p class="aciklamaMetni">${escapeHtml(bolum.aciklama)}</p>
      <div class="bilimGrid">
        ${bolum.kartlar.map(k => `
          <div class="bilimKart">
            <div class="bilimGorsel">${k.gorsel}</div>
            <h4>${escapeHtml(k.baslik)}</h4>
            <p>${escapeHtml(k.bilgi)}</p>
          </div>
        `).join('')}
      </div>
    `;
  });
}

function atlasSekmesiGoster(sekme) {
  document.querySelectorAll('.atlasSekmeBtn').forEach(b => b.classList.toggle('aktif', b.dataset.sekme === sekme));
  document.querySelectorAll('.atlasIcerik').forEach(i => {
    i.style.display = i.id === `atlas-${sekme}` ? 'block' : 'none';
  });
}

document.querySelectorAll('.atlasSekmeBtn').forEach(btn => {
  btn.addEventListener('click', () => atlasSekmesiGoster(btn.dataset.sekme));
});

// Atlas içeriği okuma verisinden bağımsız statik içeriktir — sayfa yüklenince bir kez oluşturulur.
ulkeleriGoster();
bilimDunyasiniGoster();
