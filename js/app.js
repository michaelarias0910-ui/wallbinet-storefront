document.addEventListener("DOMContentLoaded", () => {
  let selectedSize = WALLBINET_DATA.sizes[0];
  let selectedColor = WALLBINET_DATA.colors[0];
  let quantity = 1;

  const mainProductImg = document.getElementById("mainProductImg");
  const galleryThumbs = document.getElementById("galleryThumbs");
  const sizeOptions = document.getElementById("sizeOptions");
  const colorOptions = document.getElementById("colorOptions");
  const displayPrice = document.getElementById("displayPrice");
  const productQtyEl = document.getElementById("productQty");

  // Render Gallery Thumbnails
  WALLBINET_DATA.gallery.forEach((img, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thumb-btn" + (idx === 0 ? " active" : "");
    btn.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
    btn.addEventListener("click", () => {
      mainProductImg.src = img.src;
      document.querySelectorAll(".thumb-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
    galleryThumbs.appendChild(btn);
  });

  // Render Size Selector
  function renderSizes() {
    sizeOptions.innerHTML = "";
    WALLBINET_DATA.sizes.forEach(size => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-card" + (selectedSize.id === size.id ? " active" : "");
      btn.innerHTML = `<strong>${size.label} (${formatPeso(size.price)})</strong><span>${size.dimensions}</span>`;
      btn.addEventListener("click", () => {
        selectedSize = size;
        displayPrice.textContent = formatPeso(size.price);
        renderSizes();
      });
      sizeOptions.appendChild(btn);
    });
  }

  // Render Color Selector
  function renderColors() {
    colorOptions.innerHTML = "";
    WALLBINET_DATA.colors.forEach(color => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color-btn" + (selectedColor.id === color.id ? " active" : "");
      btn.innerHTML = `<span class="swatch" style="background:${color.hex};"></span><span>${color.label}</span>`;
      btn.addEventListener("click", () => {
        selectedColor = color;
        renderColors();
      });
      colorOptions.appendChild(btn);
    });
  }

  renderSizes();
  renderColors();

  // Quantity Controls
  document.getElementById("decQtyBtn").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      productQtyEl.textContent = quantity;
    }
  });

  document.getElementById("incQtyBtn").addEventListener("click", () => {
    quantity++;
    productQtyEl.textContent = quantity;
  });

  // Cart Drawer Open / Close
  const cartDrawer = document.getElementById("cartDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");

  function openCart() {
    renderCart();
    cartDrawer.classList.add("open");
    drawerBackdrop.classList.add("open");
  }

  function closeCart() {
    cartDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("open");
  }

  document.getElementById("openCartBtn").addEventListener("click", openCart);
  document.getElementById("closeCartBtn").addEventListener("click", closeCart);
  drawerBackdrop.addEventListener("click", closeCart);

  // Add to Cart
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const cart = getCart();
    const existingIndex = cart.findIndex(
      item => item.sizeId === selectedSize.id && item.colorId === selectedColor.id
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += quantity;
    } else {
      cart.push({
        uid: Date.now() + Math.random().toString(16).slice(2),
        sizeId: selectedSize.id,
        colorId: selectedColor.id,
        qty: quantity
      });
    }

    saveCart(cart);
    quantity = 1;
    productQtyEl.textContent = 1;
    updateCartBadge();
    openCart();
  });

  function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("cartCountBadge").textContent = totalItems;
  }

  // Render Cart with Inline Edit (Size, Color, Quantity) & Delete
  function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cartItemsContainer");
    const subtotalEl = document.getElementById("cartSubtotal");
    const checkoutBtn = document.getElementById("proceedCheckoutBtn");

    updateCartBadge();

    if (cart.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#666; margin-top:40px;">Your cart is empty. Select a Wallbinet size and finish to get started.</p>`;
      subtotalEl.textContent = "₱0";
      checkoutBtn.style.pointerEvents = "none";
      checkoutBtn.style.opacity = "0.5";
      return;
    }

    checkoutBtn.style.pointerEvents = "auto";
    checkoutBtn.style.opacity = "1";

    let subtotal = 0;
    container.innerHTML = "";

    cart.forEach((item, index) => {
      const sizeObj = WALLBINET_DATA.sizes.find(s => s.id === item.sizeId) || WALLBINET_DATA.sizes[0];
      const lineTotal = sizeObj.price * item.qty;
      subtotal += lineTotal;

      const sizeOptionsHtml = WALLBINET_DATA.sizes
        .map(s => `<option value="${s.id}" ${s.id === item.sizeId ? "selected" : ""}>${s.label} (${formatPeso(s.price)})</option>`)
        .join("");

      const colorOptionsHtml = WALLBINET_DATA.colors
        .map(c => `<option value="${c.id}" ${c.id === item.colorId ? "selected" : ""}>${c.label}</option>`)
        .join("");

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-item-top">
          <div>
            <strong>Wallbinet Study &amp; Work Cabinet</strong>
            <div style="font-size:0.84rem; color:#555;">${sizeObj.dimensions} • ${item.colorId}</div>
          </div>
          <button type="button" data-del="${index}" style="background:none; border:none; color:var(--color-danger); font-weight:700; cursor:pointer; font-size:0.85rem;">
            Delete
          </button>
        </div>
        <div class="cart-edit-controls">
          <select data-edit-size="${index}" aria-label="Edit Size">${sizeOptionsHtml}</select>
          <select data-edit-color="${index}" aria-label="Edit Color">${colorOptionsHtml}</select>
          <div class="qty-box" style="height:32px;">
            <button type="button" data-dec="${index}" style="width:26px; height:30px;">−</button>
            <span style="min-width:24px; font-size:0.88rem;">${item.qty}</span>
            <button type="button" data-inc="${index}" style="width:26px; height:30px;">+</button>
          </div>
        </div>
        <div style="text-align:right; font-weight:700; margin-top:8px; color:var(--color-walnut);">
          ${formatPeso(lineTotal)}
        </div>
      `;
      container.appendChild(div);
    });

    subtotalEl.textContent = formatPeso(subtotal);

    // Bind Edit & Delete Events
    container.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.del);
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      });
    });

    container.querySelectorAll("[data-edit-size]").forEach(sel => {
      sel.addEventListener("change", () => {
        const idx = Number(sel.dataset.editSize);
        cart[idx].sizeId = sel.value;
        saveCart(cart);
        renderCart();
      });
    });

    container.querySelectorAll("[data-edit-color]").forEach(sel => {
      sel.addEventListener("change", () => {
        const idx = Number(sel.dataset.editColor);
        cart[idx].colorId = sel.value;
        saveCart(cart);
        renderCart();
      });
    });

    container.querySelectorAll("[data-dec]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.dec);
        if (cart[idx].qty > 1) {
          cart[idx].qty--;
        } else {
          cart.splice(idx, 1);
        }
        saveCart(cart);
        renderCart();
      });
    });

    container.querySelectorAll("[data-inc]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.inc);
        cart[idx].qty++;
        saveCart(cart);
        renderCart();
      });
    });
  }

  // Render FAQ Accordion
  const faqContainer = document.getElementById("faqContainer");
  WALLBINET_DATA.faqs.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "faq-item" + (idx === 0 ? " open" : "");
    div.innerHTML = `
      <button type="button" class="faq-question">
        <span>${item.q}</span>
        <span>+</span>
      </button>
      <div class="faq-answer">${item.a}</div>
    `;
    div.querySelector(".faq-question").addEventListener("click", () => {
      div.classList.toggle("open");
    });
    faqContainer.appendChild(div);
  });

  // Wholesale Inquiry Submit
  document.getElementById("wholesaleForm").addEventListener("submit", e => {
    e.preventDefault();
    e.target.reset();
    document.getElementById("wholesaleMsg").style.display = "block";
  });

  updateCartBadge();
});