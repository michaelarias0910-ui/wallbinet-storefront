// Set your private administrator passcode here
const ADMIN_PASSCODE = "Wallbinet2026!";

document.addEventListener("DOMContentLoaded", () => {
  const loginCard = document.getElementById("adminLoginCard");
  const dashboard = document.getElementById("adminDashboard");
  const ordersList = document.getElementById("adminOrdersList");

  function showDashboard() {
    loginCard.style.display = "none";
    dashboard.style.display = "block";
    renderAdminOrders();
  }

  if (sessionStorage.getItem("wallbinet_admin_unlocked") === "true") {
    showDashboard();
  }

  document.getElementById("adminAuthForm").addEventListener("submit", e => {
    e.preventDefault();
    const entered = document.getElementById("adminPassInput").value;
    if (entered === ADMIN_PASSCODE) {
      sessionStorage.setItem("wallbinet_admin_unlocked", "true");
      showDashboard();
    } else {
      document.getElementById("adminAuthError").style.display = "block";
    }
  });

  document.getElementById("adminLogoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("wallbinet_admin_unlocked");
    window.location.reload();
  });

  function renderAdminOrders() {
    const orders = getOrders();
    if (orders.length === 0) {
      ordersList.innerHTML = `<div class="card"><p>No customer orders recorded yet.</p></div>`;
      return;
    }

    ordersList.innerHTML = "";
    orders.forEach((order, idx) => {
      const itemsSummary = order.items
        .map(it => `${it.sizeId.toUpperCase()} (${it.colorId}) ×${it.qty}`)
        .join(", ");

      const card = document.createElement("div");
      card.className = "card";
      card.style.marginBottom = "18px";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
          <div>
            <strong>${order.orderId}</strong> — ${order.customerName} (${order.customerEmail} | ${order.customerPhone})
            <div style="font-size:0.88rem; color:#555;">Address: ${order.customerAddress}</div>
            <div style="font-size:0.88rem; color:var(--color-walnut); font-weight:600;">Items: ${itemsSummary} • ${order.paymentMethod} (${formatPeso(order.totalAmount)})</div>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <a href="tracking.html?order=${order.orderId}" target="_blank" class="btn btn-outline" style="padding:7px 12px; font-size:0.85rem;">View Tracking</a>
            <button type="button" data-del-order="${idx}" class="btn" style="padding:7px 12px; font-size:0.85rem; background:var(--color-danger); color:#fff;">Delete</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1.4fr auto; gap:10px; align-items:center; background:var(--color-bg); padding:12px; border-radius:8px;">
          <select id="statusSel-${idx}" class="form-control">
            <option value="Order Confirmed" ${order.currentStatus === "Order Confirmed" ? "selected" : ""}>Order Confirmed</option>
            <option value="In Production / Quality Check" ${order.currentStatus === "In Production / Quality Check" ? "selected" : ""}>In Production / Quality Check</option>
            <option value="Dispatched from Workshop" ${order.currentStatus === "Dispatched from Workshop" ? "selected" : ""}>Dispatched from Workshop</option>
            <option value="In Transit" ${order.currentStatus === "In Transit" ? "selected" : ""}>In Transit</option>
            <option value="Out for Delivery" ${order.currentStatus === "Out for Delivery" ? "selected" : ""}>Out for Delivery</option>
            <option value="Delivered" ${order.currentStatus === "Delivered" ? "selected" : ""}>Delivered</option>
          </select>
          <input type="text" id="locInput-${idx}" class="form-control" value="${order.currentLocation}" placeholder="Current hub or city location" />
          <button type="button" data-upd-order="${idx}" class="btn btn-oak">Update Tracking</button>
        </div>
      `;
      ordersList.appendChild(card);
    });

    ordersList.querySelectorAll("[data-upd-order]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.updOrder);
        const newStatus = document.getElementById(`statusSel-${idx}`).value;
        const newLoc = document.getElementById(`locInput-${idx}`).value.trim();
        const now = new Date().toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });

        orders[idx].currentStatus = newStatus;
        orders[idx].currentLocation = newLoc;
        orders[idx].history.push({
          status: newStatus,
          location: newLoc,
          timestamp: now
        });

        saveOrders(orders);
        renderAdminOrders();
        alert(`Tracking updated for ${orders[idx].orderId}`);
      });
    });

    ordersList.querySelectorAll("[data-del-order]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.delOrder);
        if (confirm(`Delete order ${orders[idx].orderId}?`)) {
          orders.splice(idx, 1);
          saveOrders(orders);
          renderAdminOrders();
        }
      });
    });
  }
});