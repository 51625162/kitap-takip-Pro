// ============================================================
//  KİTAP TAKİP PRO — Okuma Macerası
//  Veri: localStorage ('kitapKayitlari', 'kisiler', 'dosyaArsivi')
//  Eski verilerle tam uyumlu — hiçbir kayıt silinmez.
// ============================================================

let kayitlar   = JSON.parse(localStorage.getItem('kitapKayitlari')) || [];
let kisiler    = JSON.parse(localStorage.getItem('kisiler')) || [];
let dosyaArsivi = JSON.parse(localStorage.getItem('dosyaArsivi')) || [];

let duzenlenenIndex = -1;
let grafik = null;

const RENKLER = ['#F6B93B', '#FF6F91', '#3DDC97', '#5D9CEC', '#B98CE0', '#FF9F43', '#5AC8FA'];
const KULLANICI = "TALHA";
const SIFRE = "54321";

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

function kaydetVeri() {
  localStorage.setItem('kitapKayitlari', JSON.stringify(kayitlar));
  localStorage.setItem('kisiler', JSON.stringify(kisiler));
}

function kaydetDosyaArsivi() {
  localStorage.setItem('dosyaArsivi', JSON.stringify(dosyaArsivi));
}

// ------------------------------------------------------------
// BAŞLATMA / GİRİŞ
// ------------------------------------------------------------
window.onload = function () {
  if (localStorage.getItem("girisYapildi") === "true") {
    girisGoster(false);
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

function bugununTarihiniAyarla() {
  const t = document.getElementById('tarih');
  if (t && !t.value) t.value = bugunYYYYMMDD();
}

const girisBtn = document.getElementById("girisBtn");
if (girisBtn) {
  girisBtn.addEventListener("click", function () {
    const kullanici = document.getElementById("kullaniciAdi").value.trim();
    const sifre = document.getElementById("sifre").value.trim();

    if (kullanici === KULLANICI && sifre === SIFRE) {
      localStorage.setItem("girisYapildi", "true");
      document.getElementById("hata").innerText = "";
      girisGoster(false);
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
  kaydetVeri();
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

function rozetBul(sayfa) {
  if (sayfa >= 2500) return { ad: 'Okuma Efsanesi', emoji: '👑' };
  if (sayfa >= 1000) return { ad: 'Kitap Kahramanı', emoji: '🏆' };
  if (sayfa >= 500) return { ad: 'Bilge Okuyucu', emoji: '🦉' };
  if (sayfa >= 100) return { ad: 'Meraklı Okuyucu', emoji: '📖' };
  return { ad: 'Filiz Okuyucu', emoji: '🌱' };
}

// ------------------------------------------------------------
// KİŞİ KARTLARI (kitaplık / raf görseli)
// ------------------------------------------------------------
function kisiKartlariniOlustur() {
  const alan = document.getElementById('kisiKartlari');
  if (!alan) return;

  if (kisiler.length === 0) {
    alan.innerHTML = `<div class="bosDurum">📚 Henüz okuyucu eklenmedi. Aşağıdan yeni bir okuyucu ekleyerek maceraya başlayın!</div>`;
    return;
  }

  alan.innerHTML = kisiler.map(isim => {
    const ist = kisiIstatistikleri(isim);
    const rozet = rozetBul(ist.toplamSayfa);

    const raflar = ist.tamamlanan.map((kt, i) => {
      const genislik = Math.max(14, Math.min(46, 14 + (kt.toplamSayfa / 40)));
      const renk = RENKLER[i % RENKLER.length];
      return `<div class="kitapSirti" style="background:${renk}; width:${genislik}px" title="${escapeHtml(kt.kitap)} — ${escapeHtml(kt.yazar || 'Yazar bilinmiyor')}"></div>`;
    }).join('');

    return `
      <div class="kisiKart">
        <div class="kisiKartUst">
          <h2>${escapeHtml(isim)}</h2>
          <button class="kisiSilBtn" data-isim="${escapeHtml(isim)}" title="Kişiyi Sil">✕</button>
        </div>
        <div class="rozet">${rozet.emoji} ${rozet.ad}</div>
        <div class="kisiIstatistik">
          <div><strong>${ist.toplamSayfa}</strong><span>Sayfa</span></div>
          <div><strong>${ist.tamamlanan.length}</strong><span>Kitap</span></div>
          <div><strong>${ist.gunSayisi}</strong><span>Gün</span></div>
        </div>
        <div class="rafBaslik">📚 Kitaplığı</div>
        <div class="raf">${raflar || '<span class="rafBos">Henüz tamamlanan kitap yok</span>'}</div>
      </div>
    `;
  }).join('');
}

const kisiKartlariAlani = document.getElementById('kisiKartlari');
if (kisiKartlariAlani) {
  kisiKartlariAlani.addEventListener('click', e => {
    const btn = e.target.closest('.kisiSilBtn');
    if (btn) kisiSil(btn.dataset.isim);
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

function sil(i) {
  if (!confirm('Bu kayıt silinsin mi?')) return;
  kayitlar.splice(i, 1);
  kaydetVeri();
  tumunuGuncelle();
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
    alan.innerHTML = '<p class="bosDurum">🎉 Devam eden kitap yok — yeni bir maceraya başlamaya ne dersin?</p>';
    return;
  }

  alan.innerHTML = liste.map(kt => `
    <div class="devamKart">
      <div class="devamBaslik">
        <span class="devamKisi">${escapeHtml(kt.isim)}</span>
        <span class="devamKitap">${escapeHtml(kt.kitap)}</span>
      </div>
      <div class="ilerlemeCubugu">
        <div class="ilerlemeDolu" style="width:${kt.yuzde}%"></div>
      </div>
      <div class="devamAlt">
        <span>${kt.okunan} / ${kt.toplamSayfa || '?'} sayfa</span>
        <span>%${kt.yuzde}</span>
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
  dosyaArsiviniGoster();
}
