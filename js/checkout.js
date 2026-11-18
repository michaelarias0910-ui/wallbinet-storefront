// Replace these 3 values with your EmailJS account credentials
const EMAILJS_PUBLIC_KEY = "sos9H_-zzf4P9wtg8";
const EMAILJS_SERVICE_ID = "service_h6nbxxf";
const EMAILJS_TEMPLATE_ID = "template_mjuiuqp";

if (window.emailjs && EMAILJS_PUBLIC_KEY !== "sos9H_-zzf4P9wtg8") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

document.addEventListener("DOMContentLoaded", () => {
  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = "index.html";
    return;
  }

  let selectedPayment = "GCash";
  let isEmailVerified = false;
  let generatedOtp = "";
  let verifiedEmailAddress = "";

  // Render Order Summary
  const summaryContainer = document.getElementById("checkoutSummaryItems");
  let grandTotal = 0;

  cart.forEach(item => {
    const sizeObj = WALLBINET_DATA.sizes.find(s => s.id === item.sizeId) || WALLBINET_DATA.sizes[0];
    const lineTotal = sizeObj.price * item.qty;
    grandTotal += lineTotal;

    const row = document.createElement("div");
    row.style.marginBottom = "12px";
    row.innerHTML = `
      <div style="display:flex; justify-content:space-between;">
        <strong>${sizeObj.label} (${item.colorId}) × ${item.qty}</strong>
        <span>${formatPeso(lineTotal)}</span>
      </div>
      <div style="font-size:0.83rem; color:#666;">${sizeObj.dimensions}</div>
    `;
    summaryContainer.appendChild(row);
  });

  document.getElementById("checkoutTotal").textContent = formatPeso(grandTotal);

  // Payment Method Selection
  const paymentExtraFields = document.getElementById("paymentExtraFields");
  function renderPaymentInputs() {
    if (selectedPayment === "GCash" || selectedPayment === "Maya") {
      paymentExtraFields.innerHTML = `
        <div class="form-group">
          <label>${selectedPayment} Account Mobile Number</label>
          <input type="tel" class="form-control" required placeholder="09XX-XXX-XXXX" />
        </div>
      `;
    } else if (selectedPayment === "PayPal") {
      paymentExtraFields.innerHTML = `
        <div class="form-group">
          <label>PayPal Account Email</label>
          <input type="email" class="form-control" required placeholder="buyer@paypal.com" />
        </div>
      `;
    } else if (selectedPayment === "Credit Card" || selectedPayment === "Debit Card") {
      paymentExtraFields.innerHTML = `
        <div class="form-group">
          <label>Cardholder Name</label>
          <input type="text" class="form-control" required placeholder="Name on Card" />
        </div>
        <div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:8px;">
          <input type="text" class="form-control" maxlength="19" required placeholder="Card Number" />
          <input type="text" class="form-control" maxlength="5" required placeholder="MM/YY" />
          <input type="text" class="form-control" maxlength="4" required placeholder="CVV" />
        </div>
      `;
    } else {
      paymentExtraFields.innerHTML = `
        <p style="font-size:0.88rem; color:#555; background:var(--color-bg); padding:10px; border-radius:6px;">
          Pay exact amount of <strong>${formatPeso(grandTotal)}</strong> in cash to our courier upon delivery.
        </p>
      `;
    }
  }
  renderPaymentInputs();

  document.querySelectorAll(".payment-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      selectedPayment = opt.dataset.method;
      renderPaymentInputs();
    });
  });

  // Policy Modals
  const policyModal = document.getElementById("policyModal");
  document.querySelectorAll(".policy-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const policy = WALLBINET_DATA.policies[link.dataset.policy];
      document.getElementById("policyModalTitle").textContent = policy.title;
      document.getElementById("policyModalBody").innerHTML = policy.content;
      policyModal.classList.add("open");
    });
  });

  document.getElementById("closePolicyModal").addEventListener("click", () => {
    policyModal.classList.remove("open");
  });

  // Enable Complete Payment only when Email is Verified + All 4 Checkboxes Checked
  const checkboxes = ["chkShipping", "chkReturns", "chkPrivacy", "chkContract"].map(id =>
    document.getElementById(id)
  );
  const completePaymentBtn = document.getElementById("completePaymentBtn");

  function validateSubmitReadiness() {
    const allChecked = checkboxes.every(cb => cb.checked);
    completePaymentBtn.disabled = !(isEmailVerified && allChecked);
  }

  checkboxes.forEach(cb => cb.addEventListener("change", validateSubmitReadiness));

  // Send OTP via EmailJS
  const otpStatus = document.getElementById("otpStatus");
  document.getElementById("sendOtpBtn").addEventListener("click", async () => {
    const emailVal = document.getElementById("custEmail").value.trim();
    const nameVal = document.getElementById("custName").value.trim() || "Valued Customer";

    if (!emailVal || !emailVal.includes("@")) {
      otpStatus.style.color = "var(--color-danger)";
      otpStatus.textContent = "Please enter a valid email address first.";
      return;
    }

    generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    isEmailVerified = false;
    validateSubmitReadiness();

    otpStatus.style.color = "var(--color-charcoal)";
    otpStatus.textContent = "Sending verification code to " + emailVal + "...";

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: emailVal,
        customer_name: nameVal,
        otp_code: generatedOtp
      });
      otpStatus.style.color = "var(--color-success)";
      otpStatus.textContent = "Verification code sent! Check your inbox (and spam folder).";
    } catch (err) {
      otpStatus.style.color = "var(--color-danger)";
      otpStatus.textContent = "Unable to send email. Verify your EmailJS Service ID, Template ID, and Public Key in js/checkout.js.";
    }
  });

  // Verify OTP Code
  document.getElementById("verifyOtpBtn").addEventListener("click", () => {
    const entered = document.getElementById("otpInput").value.trim();
    const emailVal = document.getElementById("custEmail").value.trim();

    if (generatedOtp && entered === generatedOtp) {
      isEmailVerified = true;
      verifiedEmailAddress = emailVal;
      otpStatus.style.color = "var(--color-success)";
      otpStatus.textContent = "✓ Email verified (" + verifiedEmailAddress + ").";
      document.getElementById("custEmail").readOnly = true;
      validateSubmitReadiness();
    } else {
      otpStatus.style.color = "var(--color-danger)";
      otpStatus.textContent = "Invalid verification code. Please check your email and try again.";
    }
  });

  // Complete Payment & Generate Tracking Order
  document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!isEmailVerified) return;

    const orderId = "WB-2026-" + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });

    const newOrder = {
      orderId,
      customerName: document.getElementById("custName").value.trim(),
      customerEmail: verifiedEmailAddress,
      customerPhone: document.getElementById("custPhone").value.trim(),
      customerAddress: document.getElementById("custAddress").value.trim(),
      paymentMethod: selectedPayment,
      items: cart,
      totalAmount: grandTotal,
      currentStatus: "Order Confirmed",
      currentLocation: "Wallbinet Workshop – Sta. Ana, Pampanga",
      history: [
        {
          status: "Order Confirmed & Payment Verified",
          location: "Wallbinet Workshop – Sta. Ana, Pampanga",
          timestamp: now
        }
      ]
    };

    const orders = getOrders();
    orders.unshift(newOrder);
    saveOrders(orders);
    localStorage.removeItem("wallbinet_cart");

    // Show Purchase Success Receipt
    const trackingRelativeUrl = `tracking.html?order=${orderId}`;
    document.getElementById("checkoutSection").style.display = "none";
    document.getElementById("successSection").style.display = "block";
    document.getElementById("receiptOrderId").textContent = orderId;
    document.getElementById("receiptEmail").textContent = verifiedEmailAddress;
    document.getElementById("receiptMethod").textContent = selectedPayment;
    document.getElementById("receiptTotal").textContent = formatPeso(grandTotal);

    const trackLink = document.getElementById("receiptTrackLink");
    trackLink.href = trackingRelativeUrl;
    trackLink.textContent = trackingRelativeUrl;
    document.getElementById("trackNowBtn").href = trackingRelativeUrl;
  });
});