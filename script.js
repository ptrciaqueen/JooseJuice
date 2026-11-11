// ===========================
// DATA MENU
// ===========================
const MENU = [
  { id: 'Golden_Rise', name: 'Golden Rise', price: 15000, desc: 'Signature blend of Carrot,Apple,and Pineapple' },
  { id: 'Pine_Apple', name: 'Pine Apple', price: 15000, desc: 'Pure duo Pineapple and Apple' },
  { id: 'Green_Pulse', name: 'Green Pulse', price: 15000, desc: 'Cucumber meets Pineapple and Kiwi' },
  { id: 'Sunkist', name: 'Sunkist Juice', price: 15000, desc: 'Fresh Orange Sunkist Juice' },
  { id: 'Semangka', name: 'Semangka', price: 13000, desc: 'Fresh Watermelon Juice' },
  { id: 'Nanas', name: 'Nanas', price: 13000, desc: 'Fresh Pineapple Juice' },
  { id: 'Mangga', name: 'Mangga', price: 13000, desc: 'Fresh Manggo Juice' },
  { id: 'Apel', name: 'Apel', price: 13000, desc: 'Fresh Apple Juice' },
  { id: 'Alpukat', name: 'Alpukat', price: 13000, desc: 'Fresh Avacado Juice' },
  { id: 'Melon', name: 'Melon', price: 13000, desc: 'Fresh Honeydew Juice' },
  { id: 'Buah_Naga', name: 'Buah Naga', price: 13000, desc: 'Fresh Dragon Fruit Juice' },
  { id: 'Lemon', name: 'Lemon', price: 13000, desc: 'Fresh Lemon Juice' },
  { id: 'Wortel', name: 'Wortel', price: 13000, desc: 'Fresh Carrot Juice' },
  { id: 'Sun_Drift', name: 'Sun Drift', price: 17000, desc: 'Sunkist and Apple Fusion' },
  { id: 'Neon_Gut', name: 'Neon Gut', price: 17000, desc: 'Sunkist x Yakult creamy crush' },
  { id: 'Honey_Rush', name: 'Honey Rush', price: 17000, desc: 'Sunkist infusued with honey' },
  { id: 'Mix_Jus_Suka_-_Suka', name: 'Mix Jus Suka-Suka', price: 15000, desc: 'Create your own blended' },
  { id: 'Cup_Large', name: 'Charge Large Cup', price: 3000, desc: 'Charge Large Cup' }
];

// ===========================
// ELEMENT
// ===========================
const menuContainer = document.getElementById("menu");
const cartList = document.getElementById("cart-list");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const historyEl = document.getElementById("history");

const btnOrder = document.getElementById("place-order");
const btnClear = document.getElementById("clear-cart");
const btnClearHistory = document.getElementById("clear-history");


let cart = JSON.parse(localStorage.getItem("cart")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

// ===========================
// TAMPILKAN MENU (SESUAI CSS)
// ===========================
function displayMenu() {
  menuContainer.innerHTML = "";

  MENU.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.desc}</p>

      <div class="meta">
        <span class="price">Rp ${item.price.toLocaleString("id-ID")}</span>
        <button class="btn small primary" onclick="addToCart('${item.id}')">
          Tambah
        </button>
      </div>
    `;

    menuContainer.appendChild(div);
  });
}

// ===========================
// ADD TO CART
// ===========================
function addToCart(id) {
  const item = MENU.find(m => m.id === id);
  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1
    });
  }

  saveCart();
  renderCart();
}

// ===========================
// SIMPAN CART
// ===========================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===========================
// TAMPILKAN CARD CART
// ===========================
function renderCart() {
  cartList.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Keranjang kosong</p>";
    subtotalEl.innerText = "Rp0";
    taxEl.innerText = "Rp0";
    totalEl.innerText = "Rp0";
    btnOrder.disabled = true;
    return;
  }

  cart.forEach((item, index) => {
    const totalItem = item.qty * item.price;
    subtotal += totalItem;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="meta">
        <strong>${item.name}</strong><br>
        <small>${item.qty} x Rp ${item.price.toLocaleString("id-ID")}</small>
      </div>

      <div>
        <span class="price">Rp ${totalItem.toLocaleString("id-ID")}</span><br>
        <button class="btn small" onclick="removeItem(${index})">Hapus</button>
      </div>
    `;

    cartList.appendChild(div);
  });

  const tax = 0; // PPN 0%
  const total = subtotal + tax;

  subtotalEl.innerText = `Rp ${subtotal.toLocaleString("id-ID")}`;
  taxEl.innerText = `Rp ${tax.toLocaleString("id-ID")}`;
  totalEl.innerText = `Rp ${total.toLocaleString("id-ID")}`;

  btnOrder.disabled = false;
}

// ===========================
// HAPUS ITEM
// ===========================
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// ===========================
// GENERATE NOMOR TRANSAKSI
// ===========================

function generateNomorTransaksi() {

  let nomorTerakhir = Number(
    localStorage.getItem("nomorTransaksiTerakhir") || 0
  );

  nomorTerakhir++;

  localStorage.setItem(
    "nomorTransaksiTerakhir",
    nomorTerakhir
  );

  return String(nomorTerakhir).padStart(3, "0");
}


// ===========================
// HITUNG ESTIMASI SELESAI
// ===========================

function hitungEstimasi(waktuPesan, menit) {

  const waktu = new Date(waktuPesan);

  waktu.setMinutes(
    waktu.getMinutes() + Number(menit)
  );

  return waktu.toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


// ===========================
// PLACE ORDER -> KASIR
// ===========================

btnOrder.addEventListener("click", () => {

  if (cart.length === 0) {

    alert("Keranjang kosong!");

    return;
  }


  // ===========================
  // AMBIL NAMA CUSTOMER
  // ===========================

  const customerName =
    document.getElementById(
      "customer-name"
    ).value.trim();


  if (!customerName) {

    alert(
      "Silakan masukkan nama customer terlebih dahulu!"
    );

    document.getElementById(
      "customer-name"
    ).focus();

    return;
  }


  // ===========================
  // AMBIL ESTIMASI
  // ===========================

  const estimateMinutes =
    document.getElementById(
      "estimate-time"
    ).value;


  // ===========================
  // HITUNG TOTAL
  // ===========================

  const subtotal = cart.reduce(
    (total, item) =>
      total + (item.price * item.qty),
    0
  );


  const tax = 0;

  const total =
    subtotal + tax;


  // ===========================
  // WAKTU PESAN
  // ===========================

  const waktuPesan =
    new Date();


  const waktuSelesai =
    hitungEstimasi(
      waktuPesan,
      estimateMinutes
    );


  // ===========================
  // NOMOR TRANSAKSI
  // ===========================

  const nomorTransaksi =
    generateNomorTransaksi();


  // ===========================
  // BUAT PESANAN
  // ===========================

  const order = {

    id: nomorTransaksi,

    customer:
      customerName,

    waktu:
      waktuPesan.toLocaleString(
        "id-ID"
      ),

    waktuSelesai:
      waktuSelesai,

    estimasiMenit:
      Number(estimateMinutes),

    items:
      [...cart],

    subtotal:
      subtotal,

    tax:
      tax,

    total:
      total,

    status:
      "Menunggu"

  };


  // ===========================
  // KIRIM KE KASIR
  // ===========================

  let pesananKasir =
    JSON.parse(
      localStorage.getItem(
        "pesananKasir"
      )
    ) || [];


  pesananKasir.push(order);


  localStorage.setItem(
    "pesananKasir",
    JSON.stringify(
      pesananKasir
    )
  );


  // ===========================
  // SIMPAN HISTORY CUSTOMER
  // ===========================

  history.push(order);


  localStorage.setItem(
    "history",
    JSON.stringify(
      history
    )
  );


  // ===========================
  // RESET CART
  // ===========================

  cart = [];

  saveCart();


  // ===========================
  // INFORMASI PESANAN
  // ===========================

  alert(
    "Pesanan berhasil dibuat!\n\n" +
    "No. Transaksi : " +
    nomorTransaksi +
    "\n" +
    "Customer : " +
    customerName +
    "\n" +
    "Estimasi selesai : " +
    waktuSelesai
  );


  // ===========================
  // PINDAH KE KASIR
  // ===========================

  window.location.href =
    "kasir.html";

});

// ===========================
// CLEAR CART
// ===========================
btnClear.addEventListener("click", () => {
  if (confirm("Kosongkan keranjang?")) {
    cart = [];
    saveCart();
    renderCart();
  }
});


// ===========================
// HISTORY
// ===========================
function tampilHistory() {
  historyEl.innerHTML = "";

  if (history.length === 0) {
    historyEl.innerHTML = "<p>Belum ada riwayat</p>";
    return;
  }

  history.forEach(h => {
    const div = document.createElement("div");
    div.className = "history-item";

    div.innerHTML = `
      <div>
        <strong>${h.id}</strong><br>
        <small>${h.waktu}</small>
      </div>
      <div class="price">Rp ${h.total}</div>
    `;

    historyEl.appendChild(div);
  });
}

// ===========================
// CLEAR HISTORY
// ===========================
btnClearHistory.addEventListener("click", () => {
  if (confirm("Hapus semua riwayat?")) {
    history = [];
    localStorage.removeItem("history");
    tampilHistory();
  }
});


// ===========================
// JAM REAL TIME
// ===========================
function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText = now.toLocaleTimeString("id-ID");
}
setInterval(updateClock, 1000);


// ===========================
// INITIAL LOAD
// ===========================
displayMenu();
renderCart();
tampilHistory();
updateClock();

document.getElementById("print-receipt").addEventListener("click", function() {

  // Ambil data struk
  const receiptData = {
    id: document.getElementById("receipt-id").innerText,
    date: document.getElementById("receipt-date").innerText,
    items: document.getElementById("receipt-items").innerHTML,
    subtotal: document.getElementById("r-subtotal").innerText,
    tax: document.getElementById("r-tax").innerText,
    total: document.getElementById("r-total").innerText
  };

  // Simpan ke localStorage
  localStorage.setItem("receiptData", JSON.stringify(receiptData));

  // Pindah ke halaman struk
  window.location.href = "struk.html";
});