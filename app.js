const WHATSAPP_NUMBER = '919119600421';

const menu = [
  { id: 1, category: 'Mushroom', name: 'Matar Mushroom', price: 280, desc: 'Tender mushrooms with peas in rich masala.' },
  { id: 2, category: 'Mushroom', name: 'Mushroom Masala', price: 300, desc: 'Classic thick mushroom curry.' },
  { id: 3, category: 'Daal', name: 'Dal Fry', price: 150, desc: 'Homestyle yellow lentils, tempered.' },
  { id: 4, category: 'Daal', name: 'Dal Makhani', price: 240, desc: 'Creamy slow-cooked black lentils.' },
  { id: 5, category: 'Rice', name: 'Jeera Rice', price: 120, desc: 'Basmati rice tempered with cumin.' },
  { id: 6, category: 'Rice', name: 'Veg Biryani', price: 200, desc: 'Layered basmati with vegetables.' },
  { id: 7, category: 'Tandoori', name: 'Butter Naan', price: 45, desc: 'Soft naan finished with butter.' },
  { id: 8, category: 'Tandoori', name: 'Garlic Naan', price: 50, desc: 'Naan topped with fresh garlic.' },
  { id: 9, category: 'Paratha', name: 'Paneer Paratha', price: 90, desc: 'Stuffed with spiced paneer filling.' },
  { id: 10, category: 'Extras', name: 'Mix Raita', price: 90, desc: 'Cooling yogurt with veggies.' },
  { id: 11, category: 'Tea', name: 'Signature Tea', price: 20, desc: 'NH28 style masala ginger tea.' },
  { id: 12, category: 'Sweet', name: 'Gulab Jamun (2pc)', price: 40, desc: 'Warm syrupy milk-solid dumplings.' }
];

const cart = new Map();

const menuGrid = document.getElementById('menuGrid');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

function renderMenu() {
  menuGrid.innerHTML = menu
    .map(
      (item) => `
      <article class="menu-item">
        <p class="tag">${item.category}</p>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="menu-meta">
          <span class="price">₹${item.price}</span>
          <button class="btn btn-primary" onclick="addToCart(${item.id})">Add</button>
        </div>
      </article>`
    )
    .join('');
}

function addToCart(id) {
  const selected = menu.find((item) => item.id === id);
  if (!selected) return;
  const current = cart.get(id);
  if (current) {
    current.qty += 1;
  } else {
    cart.set(id, { ...selected, qty: 1 });
  }
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.get(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.delete(id);
  renderCart();
}

function renderCart() {
  const items = Array.from(cart.values());
  cartCount.textContent = items.reduce((sum, i) => sum + i.qty, 0);

  if (!items.length) {
    cartItems.innerHTML = '<p>Your cart is empty. Add items from menu.</p>';
    cartTotal.textContent = '0';
    return;
  }

  cartItems.innerHTML = items
    .map(
      (item) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong><br/>
          <small>₹${item.price} each</small>
        </div>
        <div class="qty-controls">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <strong>${item.qty}</strong>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <strong>₹${item.qty * item.price}</strong>
        <button onclick="removeItem(${item.id})">🗑️</button>
      </div>`
    )
    .join('');

  cartTotal.textContent = items.reduce((sum, i) => sum + i.qty * i.price, 0).toString();
}

function removeItem(id) {
  cart.delete(id);
  renderCart();
}

function placeOrder() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const items = Array.from(cart.values());

  if (!items.length) {
    alert('Cart is empty. Please add menu items first.');
    return;
  }
  if (!name || !address) {
    alert('Please enter your name and location/table details.');
    return;
  }

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  let text = `*NEW ORDER: NARAYAN RESTAURANT*%0A`;
  text += `--------------------------%0A`;
  text += `*Customer:* ${encodeURIComponent(name)}%0A`;
  text += `*Location/Table:* ${encodeURIComponent(address)}%0A`;
  text += `*Phone:* ${encodeURIComponent(phone || 'N/A')}%0A`;
  text += `--------------------------%0A`;
  text += `*Items Ordered:*%0A`;

  items.forEach((i) => {
    text += `• ${encodeURIComponent(i.name)} x${i.qty} = ₹${i.qty * i.price}%0A`;
  });

  text += `--------------------------%0A`;
  text += `*TOTAL: ₹${total}*%0A`;
  text += `_Ordered from Narayan Restaurant Website_`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
}

document.getElementById('openCartBtn').addEventListener('click', () => {
  cartModal.classList.remove('hidden');
});

document.getElementById('closeCartBtn').addEventListener('click', () => {
  cartModal.classList.add('hidden');
});

document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);

window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeItem = removeItem;

renderMenu();
renderCart();