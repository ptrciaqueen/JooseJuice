// =============================
// AMBIL PESANAN DARI LOCALSTORAGE
// =============================
let pesanan = JSON.parse(localStorage.getItem("pesananKasir") || "[]");
let riwayat = JSON.parse(localStorage.getItem("riwayatKasir") || "[]");

const pesananGrid = document.getElementById("pesananGrid");
const summaryList = document.getElementById("summaryList");
const totalHargaEl = document.getElementById("totalHarga");
const historyList = document.getElementById("historyList");
const receipt = document.getElementById("receipt");
const receiptContent = document.getElementById("receiptContent");

let pesananDipilih = null;


// =============================
// TAMPILKAN PESANAN MASUK
// =============================

function tampilPesanan() {
  pesananGrid.innerHTML = "";

  if (pesanan.length === 0) {
    pesananGrid.innerHTML = "<p>Tidak ada pesanan.</p>";
    return;
  }

  pesanan.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>${p.id}</strong><br>
      <small>${p.waktu}</small><br><br>
     <strong>Total:</strong> Rp ${Number(p.total).toLocaleString("id-ID")}<br><br>
      <button class="btn small primary" onclick="pilihPesanan(${index})">Proses</button>
    `;

    pesananGrid.appendChild(card);
  });
}

tampilPesanan();


// =============================
// PILIH PESANAN
// =============================

function pilihPesanan(index) {
  pesananDipilih = pesanan[index];

  summaryList.innerHTML = "";

  pesananDipilih.items.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `${item.name} x ${item.qty} = Rp ${Number(item.price * item.qty).toLocaleString("id-ID")}`;
    summaryList.appendChild(div);
  });

  totalHargaEl.textContent = Number(pesananDipilih.total).toLocaleString("id-ID");
}


// =============================
// CETAK STRUK
// =============================

function cetakStruk() {
  if (!pesananDipilih) {
    alert("Pilih pesanan terlebih dahulu!");
    return;
  }

  receipt.classList.remove("hidden");

  let html = `
    <strong>ID:</strong> ${pesananDipilih.id}<br>
    <small>${pesananDipilih.waktu}</small><hr>
  `;

  pesananDipilih.items.forEach(item => {
    html += `
      ${item.name}<br>
      ${item.qty} x Rp ${item.price} = Rp ${item.qty * item.price}<br><br>
    `;
  });

  html += `<strong>Total: Rp ${Number(pesananDipilih.total).toLocaleString("id-ID")}</strong>`;

  receiptContent.innerHTML = html;

  // simpan ke riwayat
  riwayat.push(pesananDipilih);
  localStorage.setItem("riwayatKasir", JSON.stringify(riwayat));

  // hapus dari pesanan masuk
  pesanan = pesanan.filter(p => p.id !== pesananDipilih.id);
  localStorage.setItem("pesananKasir", JSON.stringify(pesanan));

  pesananDipilih = null;

  tampilPesanan();
  tampilRiwayat();
}


// =============================
// PRINT STRUK
// =============================

function printStruk() {
  window.print();
}

function closeStruk() {
  receipt.classList.add("hidden");
}


// =============================
// RESET SEMUA PESANAN
// =============================

function resetPesanan() {
  if (!confirm("Hapus semua pesanan masuk?")) return;

  pesanan = [];
  localStorage.removeItem("pesananKasir");

  tampilPesanan();
  summaryList.innerHTML = "";
  totalHargaEl.textContent = 0;
}


// =============================
// RIWAYAT TRANSAKSI
// =============================

function tampilRiwayat() {
  historyList.innerHTML = "";

  if (riwayat.length === 0) {
    historyList.innerHTML = "<p>Belum ada transaksi</p>";
    return;
  }

  riwayat.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${r.id}</strong><br>
      <small>${r.waktu}</small><br>
      Total: Rp ${r.total}
    `;
    historyList.appendChild(div);
  });
}

tampilRiwayat();


// =============================
// LOGOUT
// =============================
function logout() {
  window.location.href = "login.html";
}
