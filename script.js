// ===============================
// KİTAP TAKİP SİSTEMİ
// Bölüm 1 - Veri ve Başlatma
// ===============================

// Kitap kayıtları
let kayitlar = JSON.parse(localStorage.getItem('kitapKayitlari')) || [];

// Kişiler
let kisiler = JSON.parse(localStorage.getItem('kisiler')) || [];

// Sayfa açılınca çalıştır
window.onload = function () {

  if (localStorage.getItem("girisYapildi") === "true") {
    document.getElementById("girisEkrani").style.display = "none";
    document.getElementById("uygulama").style.display = "block";
  } else {
    document.getElementById("girisEkrani").style.display = "flex";
    document.getElementById("uygulama").style.display = "none";
  }
  kisiListesiniGuncelle();
  kisiKartlariniOlustur();
  guncelle();
  grafikGuncelle();
};

// ===============================
// KİŞİ EKLE
// ===============================

const kisiBtn = document.getElementById('kisiEkleBtn');

if (kisiBtn) {
  kisiBtn.addEventListener('click', kisiEkle);
}

function kisiEkle() {
  const input = document.getElementById('yeniKisi');

  let ad = input.value.trim();

  if (ad == '') {
    alert('Kişi adı giriniz.');

    return;
  }

  if (kisiler.includes(ad)) {
    alert('Bu kişi zaten kayıtlı.');

    return;
  }

  kisiler.push(ad);

  localStorage.setItem('kisiler', JSON.stringify(kisiler));

  input.value = '';

  kisiListesiniGuncelle();

  kisiKartlariniOlustur();
}

// ===============================
// KİŞİ LİSTESİ
// ===============================

function kisiListesiniGuncelle() {
  const select = document.getElementById('kisi');

  const liste = document.getElementById('kisiListesi');

  if (select) {
    select.innerHTML = '';

    kisiler.forEach(function (ad) {
      select.innerHTML += `<option value="${ad}">${ad}</option>`;
    });
  }

  if (liste) {
    liste.innerHTML = '';

    kisiler.forEach(function (ad) {
      liste.innerHTML += `<option>${ad}</option>`;
    });
  }
}
function guncelle() {
  const kisiler = JSON.parse(localStorage.getItem('kisiler')) || [];

  let istatistik = {};

  kisiler.forEach((isim) => {
    istatistik[isim] = {
      kitap: 0,
      sayfa: 0,
    };
  });

  kayitlar.forEach((k) => {
    if (!istatistik[k.kisi]) {
      istatistik[k.kisi] = {
        kitap: 0,
        sayfa: 0,
      };
    }

    istatistik[k.kisi].kitap++;
    istatistik[k.kisi].sayfa += k.okunanSayfa;
  });

  kisiler.forEach((isim) => {
    const kitap = document.getElementById(isim + 'Kitap');
    const sayfa = document.getElementById(isim + 'Sayfa');

    if (kitap) kitap.innerText = istatistik[isim].kitap;
    if (sayfa) sayfa.innerText = istatistik[isim].sayfa;
  });

  let toplamSayfa = 0;

  kayitlar.forEach((k) => {
    toplamSayfa += k.okunanSayfa;
  });

  document.getElementById('toplamSayfaGenel').innerText = toplamSayfa;
  document.getElementById('toplamKitapGenel').innerText = kayitlar.length;

  let lider = '-';
  let enYuksek = -1;

  Object.keys(istatistik).forEach((isim) => {
    if (istatistik[isim].sayfa > enYuksek) {
      enYuksek = istatistik[isim].sayfa;
      lider = isim;
    }
  });

  document.getElementById('lider').innerText = lider;
  const body = document.getElementById('kayitlarBody');

  if (body) {
    body.innerHTML = '';

    kayitlar.forEach(function (k, i) {
      body.innerHTML += `
        <tr>
          <td>${k.tarih}</td>
          <td>${k.kisi}</td>
          <td>${k.kitap}</td>
          <td>${k.yazar}</td>
          <td>${k.okunanSayfa}</td>
  
          <td>
  
            <button onclick="duzenle(${i})">✏️</button>
  
            <button onclick="sil(${i})">🗑️</button>
  
          </td>
  
        </tr>
        `;
    });
  }

  kitapArsiviniGoster();
}
function kitapArsiviniGoster() {
  const arsivBody = document.getElementById('arsivBody');

  if (!arsivBody) return;

  arsivBody.innerHTML = '';

  let eklenen = [];

  kayitlar.forEach(function (k) {
    let anahtar = k.kisi + '_' + k.kitap;

    if (eklenen.includes(anahtar)) return;

    eklenen.push(anahtar);

    arsivBody.innerHTML += `
        <tr>

            <td>${k.kitap}</td>

            <td>${k.yazar}</td>

            <td>${k.kisi}</td>

            <td>${k.toplamSayfa}</td>

        </tr>
        `;
  });
}
// =====================================
// KAYDET
// =====================================

const kaydetBtn = document.getElementById('kaydetBtn');

if (kaydetBtn) {
  kaydetBtn.addEventListener('click', kaydet);
}

function kaydet() {
  const kisi = document.getElementById('kisi').value;

  const tarih = document.getElementById('tarih').value;

  const kitap = document.getElementById('kitapAdi').value.trim();

  const yazar = document.getElementById('yazar').value.trim();

  const toplamSayfa = Number(document.getElementById('toplamSayfa').value);

  const okunanSayfa = Number(document.getElementById('okunanSayfa').value);

  if (kisi == '') {
    alert('Lütfen kişi seçiniz.');

    return;
  }

  if (kitap == '') {
    alert('Kitap adı giriniz.');

    return;
  }

  kayitlar.push({
    kisi,

    tarih,

    kitap,

    yazar,

    toplamSayfa,

    okunanSayfa,
  });

  localStorage.setItem(
    'kitapKayitlari',

    JSON.stringify(kayitlar)
  );

  document.getElementById('kitapAdi').value = '';

  document.getElementById('yazar').value = '';

  document.getElementById('toplamSayfa').value = '';

  document.getElementById('okunanSayfa').value = '';

  guncelle();
  kisiKartlariniOlustur();
}

// =====================================
// SİL
// =====================================

function sil(i) {
  if (!confirm('Bu kayıt silinsin mi?')) return;

  kayitlar.splice(i, 1);

  localStorage.setItem(
    'kitapKayitlari',

    JSON.stringify(kayitlar)
  );

  guncelle();
}

// =====================================
// DÜZENLE
// =====================================

function duzenle(i) {
  let k = kayitlar[i];
  document.getElementById('kisi').value = k.kisi;
  document.getElementById('tarih').value = k.tarih;
  document.getElementById('kitapAdi').value = k.kitap;
  document.getElementById('yazar').value = k.yazar;
  document.getElementById('toplamSayfa').value = k.toplamSayfa;
  document.getElementById('okunanSayfa').value = k.okunanSayfa;
  kayitlar.splice(i, 1);
  localStorage.setItem('kitapKayitlari', JSON.stringify(kayitlar));
  guncelle();
  alert("Kaydı düzenleyip tekrar 'Kayıt Ekle' butonuna basın.");
}

// =====================================// KİŞİ KARTLARI// =====================================

function kisiKartlariniOlustur() {
  const alan = document.getElementById('kisiKartlari');

  if (!alan) return;

  alan.innerHTML = '';

  kisiler.forEach(function (isim) {
    let kitap = 0;

    let sayfa = 0;

    kayitlar.forEach(function (k) {
      if (k.kisi == isim) {
        kitap++;

        sayfa += k.okunanSayfa;
      }
    });

    alan.innerHTML += `        
 
      <div class="kisiKart">            
 
      <h2>${isim}</h2>            
 
      <h3>${sayfa}</h3>            
 
      <p>Toplam Sayfa</p>            
 
      <hr>            
 
      <p>   ${kitap} Kitap</p>📚        
 
      </div>        `;
  });
}

guncelle();
kisiKartlariniOlustur();

const KULLANICI = "TALHA";
const SIFRE = "54321";

document.getElementById("girisBtn").addEventListener("click", function () {

  const kullanici = document.getElementById("kullaniciAdi").value.trim();
  const sifre = document.getElementById("sifre").value.trim();

  if (kullanici === KULLANICI && sifre === SIFRE) {

    localStorage.setItem("girisYapildi", "true");

    document.getElementById("girisEkrani").style.display = "none";
    document.getElementById("uygulama").style.display = "block";

  } else {

    document.getElementById("hata").innerText =
      "Kullanıcı adı veya şifre yanlış!";

  }

});


let grafik = null;
function grafikGuncelle() {
  const ctx = document.getElementById('okumaGrafik');
  if (!ctx) return;
  if (grafik) grafik.destroy();
  grafik = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: kisiler,
      datasets: [
        {
          label: 'Okunan Sayfa',
          data: kisiler.map((kisi) => {
            let toplam = 0;
            kayitlar.forEach((k) => {
              if (k.kisi === kisi) toplam += Number(k.okunanSayfa);
            });
            return toplam;
          }),
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}
grafikGuncelle();

function kisiSil(isim) {
  if (!confirm(isim + ' silinsin mi?')) return;
  kisiler = kisiler.filter((k) => k !== isim);
  kayitlar = kayitlar.filter((k) => k.kisi !== isim);
  localStorage.setItem('kisiler', JSON.stringify(kisiler));
  localStorage.setItem('kitapKayitlari', JSON.stringify(kayitlar));
  kisiListesiniGuncelle();
  kisiKartlariniOlustur();
  grafikGuncelle();
  kitapArsiviniGoster();
}
function excelAktar() {

  const veri = kayitlar.map(k => ({
      Tarih: k.tarih,
      Kisi: k.kisi,
      Kitap: k.kitap,
      Yazar: k.yazar,
      OkunanSayfa: k.okunansayfa,
      ToplamSayfa: k.toplamSayfa
  }));

  const ws = XLSX.utils.json_to_sheet(veri);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Kitaplar");

  XLSX.writeFile(wb, "KitapTakip.xlsx");
}

const cikisBtn = document.getElementById("cikisBtn");

if (cikisBtn) {
  cikisBtn.addEventListener("click", function () {
    if (confirm("Çıkış yapmak istiyor musunuz?")) {
      localStorage.removeItem("girisYapildi");
      document.getElementById("uygulama").style.display = "none";
      document.getElementById("girisEkrani").style.display = "flex";
      document.getElementById("sifre").value = "";
    }
  });
}
// ===========================
// TEMA (KARANLIK / AYDINLIK)
// ===========================

const temaBtn = document.getElementById("temaBtn");

if (temaBtn) {

  if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
    temaBtn.innerText = "☀️ Aydınlık Mod";
  }

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

const pdfBtn = document.getElementById("pdfBtn");

if (pdfBtn) {
  pdfBtn.addEventListener("click", function () {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Kitap Takip Pro Raporu", 20, 20);

    let y = 35;

    kayitlar.forEach((k, i) => {
      pdf.setFontSize(11);

      pdf.text(
        (i + 1) + ". " +
        k.kisi + " | " +
        k.kitap + " | " +
        k.okunanSayfa + " Sayfa",
        20,
        y
      );

      y += 8;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });

    pdf.save("KitapTakipRaporu.pdf");

  });
}