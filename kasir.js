// =====================================================
// DATA LOCALSTORAGE
// =====================================================

function ambilData(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);

    if (!data) {
      return defaultValue;
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : defaultValue;

  } catch (error) {

    console.error(
      "Gagal membaca localStorage:",
      key,
      error
    );

    return defaultValue;
  }
}


let pesanan = ambilData("pesananKasir");
let riwayat = ambilData("riwayatKasir");

let pesananDipilih = null;


// =====================================================
// ELEMENT HTML
// =====================================================

const pesananGrid =
  document.getElementById("pesananGrid");

const summaryList =
  document.getElementById("summaryList");

const totalHargaEl =
  document.getElementById("totalHarga");

const historyList =
  document.getElementById("historyList");

const receipt =
  document.getElementById("receipt");

const receiptContent =
  document.getElementById("receiptContent");


// =====================================================
// TAMPILKAN PESANAN
// =====================================================

function tampilPesanan() {

  if (!pesananGrid) {
    console.error("pesananGrid tidak ditemukan");
    return;
  }

  pesananGrid.innerHTML = "";

  if (pesanan.length === 0) {

    pesananGrid.innerHTML =
      "<p>Tidak ada pesanan.</p>";

    return;
  }


  pesanan.forEach((p, index) => {

    const card =
      document.createElement("div");

    card.className = "card";

    card.innerHTML = `

      <strong style="font-size:18px;">
        #${p.id || "-"}
      </strong>

      <br>

      <strong>
        Customer:
        ${p.customer || "Tidak diketahui"}
      </strong>

      <br>

      <small>
        Pesan:
        ${p.waktu || "-"}
      </small>

      <br>

      <small style="color:#2878ff;">
        Estimasi selesai:
        ${p.waktuSelesai || "-"}
      </small>

      <br><br>

      <strong>Total:</strong>

      Rp ${Number(
        p.total || 0
      ).toLocaleString("id-ID")}

      <br><br>

      <button
        class="btn small primary"
        onclick="pilihPesanan(${index})"
      >
        Proses
      </button>

    `;

    pesananGrid.appendChild(card);

  });

}


// =====================================================
// PILIH PESANAN
// =====================================================

function pilihPesanan(index) {

  if (!pesanan[index]) {

    alert("Pesanan tidak ditemukan.");

    return;
  }


  pesananDipilih =
    pesanan[index];


  if (!summaryList) {
    return;
  }


  summaryList.innerHTML = `

    <div style="
      margin-bottom:12px;
      padding:10px;
      background:#f5f5f5;
      border-radius:8px;
    ">

      <strong style="font-size:18px;">
        #${pesananDipilih.id || "-"}
      </strong>

      <br>

      Customer:
      <strong>
        ${pesananDipilih.customer || "-"}
      </strong>

      <br>

      <small>
        Pesan:
        ${pesananDipilih.waktu || "-"}
      </small>

      <br>

      <small style="color:#2878ff;">
        Estimasi selesai:
        ${pesananDipilih.waktuSelesai || "-"}
      </small>

    </div>

  `;


  // ===================================================
  // ITEM PESANAN
  // ===================================================

  if (
    !Array.isArray(pesananDipilih.items) ||
    pesananDipilih.items.length === 0
  ) {

    summaryList.innerHTML +=
      "<p>Tidak ada item.</p>";

  } else {

    pesananDipilih.items.forEach(item => {

      const div =
        document.createElement("div");

      div.style.marginBottom =
        "6px";

      const harga =
        Number(item.price || 0);

      const qty =
        Number(item.qty || 0);

      div.textContent =
        `${item.name || "Item"} x ${qty} = Rp ${(
          harga * qty
        ).toLocaleString("id-ID")}`;

      summaryList.appendChild(div);

    });

  }


  // ===================================================
  // TOTAL
  // ===================================================

  if (totalHargaEl) {

    totalHargaEl.textContent =
      Number(
        pesananDipilih.total || 0
      ).toLocaleString("id-ID");

  }

}


// =====================================================
// CETAK / BUKA STRUK
// =====================================================

function cetakStruk() {

  if (!pesananDipilih) {
    alert("Pilih pesanan terlebih dahulu!");
    return;
  }

  // ==========================================
  // SIAPKAN DATA STRUK
  // ==========================================

  const receiptData = {
    id: pesananDipilih.id || "-",

    customer: pesananDipilih.customer || "-",

    date: pesananDipilih.waktu || "-",

    estimate: pesananDipilih.waktuSelesai || "-",

    items: Array.isArray(pesananDipilih.items)
      ? pesananDipilih.items
      : [],

    subtotal: Number(
      pesananDipilih.subtotal ||
      pesananDipilih.total ||
      0
    ),

    tax: Number(
      pesananDipilih.tax || 0
    ),

    total: Number(
      pesananDipilih.total || 0
    )
  };


  // ==========================================
  // SIMPAN DATA STRUK
  // ==========================================

  localStorage.setItem(
    "receiptData",
    JSON.stringify(receiptData)
  );


  // ==========================================
  // SIMPAN RIWAYAT
  // ==========================================

  riwayat.push(pesananDipilih);

  localStorage.setItem(
    "riwayatKasir",
    JSON.stringify(riwayat)
  );


  // ==========================================
  // HAPUS PESANAN DARI PESANAN MASUK
  // ==========================================

  pesanan = pesanan.filter(
    p => p.id !== pesananDipilih.id
  );

  localStorage.setItem(
    "pesananKasir",
    JSON.stringify(pesanan)
  );


  // ==========================================
  // PINDAH KE HALAMAN STRUK
  // ==========================================

  window.location.href = "struk.html";
}


// =====================================================
// PRINT
// =====================================================

function printStruk() {

  window.print();

}


// =====================================================
// TUTUP STRUK
// =====================================================

function closeStruk() {

  if (receipt) {

    receipt.classList.add(
      "hidden"
    );

  }

}


// =====================================================
// HAPUS SEMUA PESANAN
// =====================================================

function resetPesanan() {

  if (
    !confirm(
      "Hapus semua pesanan masuk?"
    )
  ) {

    return;
  }


  pesanan = [];

  localStorage.removeItem(
    "pesananKasir"
  );

  pesananDipilih = null;


  if (summaryList) {
    summaryList.innerHTML = "";
  }

  if (totalHargaEl) {
    totalHargaEl.textContent = "0";
  }


  tampilPesanan();

}


// =====================================================
// RIWAYAT TRANSAKSI
// =====================================================

function tampilRiwayat() {

  if (!historyList) {
    return;
  }

  historyList.innerHTML = "";


  if (riwayat.length === 0) {

    historyList.innerHTML =
      "<p>Belum ada transaksi</p>";

    return;
  }


  riwayat.forEach(r => {

    const div =
      document.createElement("div");

    div.className =
      "card";


    div.innerHTML = `

      <strong>
        #${r.id || "-"}
      </strong>

      <br>

      <strong>
        Customer:
        ${r.customer || "-"}
      </strong>

      <br>

      <small>
        ${r.waktu || "-"}
      </small>

      <br>

      <small>
        Estimasi:
        ${r.waktuSelesai || "-"}
      </small>

      <br>

      Total:
      Rp ${Number(
        r.total || 0
      ).toLocaleString("id-ID")}

    `;


    historyList.appendChild(div);

  });

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

  window.location.href =
    "login.html";

}


// =====================================================
// JALANKAN PROGRAM
// =====================================================

tampilPesanan();

tampilRiwayat();