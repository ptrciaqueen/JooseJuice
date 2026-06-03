// ===========================
// DATA MENU
// ===========================
const MENU = [
  { id: 'Risol_Mayo_Smoke_Beef', name: 'Risol Mayo Smoke Beef', price: 2000, desc: 'Camilan risol berisi smoke beef, mayonais, dan telor rebus' },
  { id: 'Risol_Matcha', name: 'Risol Matcha', price: 2000, desc: 'Camilan risol dengan varian matcha kekinian berisi krim fla matcha' },
  { id: 'Bolu Karamel', name: 'Bolu Karamel', price: 1800, desc: 'Kue tradisional bertekstur kenyal, lembut, dan memiliki rongga-rongga unik menyerupai sarang semut di bagian dalamnya dan beraroma harum karamel' },
  { id: 'Dadar_Gulung_Hijau', name: 'Dadar Gulung Hijau', price: 1200, desc: 'Kelapa parut dan gula aren dibungkus dengan telur dadar tipis yang terbuat dari tepung beras dan diwarnai hijau dengan pandan' },
  { id: 'Martabak', name: 'Martabak', price: 1200, desc: 'Gorengan gurih mini berisi adonan telur, daging, dan daun bawang' },
  { id: 'Sosis_Solo', name: 'Sosis Solo', price: 1500, desc: 'Jajanan tradisional khas Kota Solo yang menyerupai risoles, namun memiliki kulit yang lebih lembut dan isian daging ayam suwir yang padat' },
  { id: 'Pestuban', name: 'Pestuban', price: 1500, desc: 'Jajanan tradisional Nusantara yang manis dan lembut dan berbahan dasar potongan pisang' },
  { id: 'Puding', name: 'Puding', price: 2500, desc: 'Hidangan penutup (dessert) yang menggabungkan puding berbahan dasar susu dan cokelat dengan tekstur kenyal dan lembut, disiram saus vla vanila yang creamy dan manis' },
  { id: 'Wingko_Babat', name: 'Wingko Babat', price: 2500, desc: 'Kue tradisional Indonesia yang terbuat dari campuran kelapa parut, tepung ketan, dan gula' },
  { id: 'Bolen_Pisang', name: 'Bolen Pisang', price: 3500, desc: 'Kue ini terdiri dari potongan buah pisang yang dibalut dengan adonan pastry berlapis (renyah di luar dan lembut di dalam), serta diberi isian tambahan seperti keju, cokelat, atau kacang sebelum dipanggang' },
  { id: 'Dimsum_Ayam', name: 'Dimsum Ayam', price: 3500, desc: 'Hidangan ringan berupa adonan daging ayam cincang yang dicampur tepung tapioka, bumbu, dan sayuran seperti wortel, dibungkus kulit pangsit' },
  { id: 'Cendol_Keju', name: 'Cendol Keju', price: 1000, desc: 'Camilan kering tradisional Indonesia yang bercita rasa asin, gurih, dan renyah' },
  { id: 'Kerupuk_Ikan', name: 'Kerupuk Ikan', price: 1000, desc: 'Camilan atau makanan pelengkap renyah khas Asia Tenggara yang terbuat dari adonan tepung tapioka/sagu dan daging ikan giling' }
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
// PLACE ORDER -> KASIR
// ===========================
btnOrder.addEventListener("click", () => {
  if (cart.length === 0) return;

  const order = {
    id: "ORD-" + Date.now(),
    waktu: new Date().toLocaleString("id-ID"),
    items: cart,
    total: totalEl.innerText.replace("Rp ", "").replace(/\./g, "")
  };

  // Simpan ke kasir
  let pesananKasir = JSON.parse(localStorage.getItem("pesananKasir") || "[]");
  pesananKasir.push(order);
  localStorage.setItem("pesananKasir", JSON.stringify(pesananKasir));

  // Simpan ke riwayat pelanggan
  history.push(order);
  localStorage.setItem("history", JSON.stringify(history));

  alert("Pesanan berhasil dikirim ke kasir ✅");

  cart = [];
  saveCart();
  renderCart();
  tampilHistory();
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
// NAVIGATION
// ===========================
function goToKasir() {
  window.location.href = 'kasir.html';
}

// ===========================
// INITIAL LOAD
// ===========================
displayMenu();
renderCart();
tampilHistory();
updateClock();
