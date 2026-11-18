const WALLBINET_DATA = {
  companyName: "Wallbinet",
  productName: "Wallbinet – Locally-Made Wall-Mounted Foldable Study & Work Cabinet Table",
  taglinePrimary: "Where Space Meets Style",
  taglineSecondary: "Smart Storage. Smart Living.",
  description:
    "A locally-made, space-saving wall-mounted cabinet with a foldable study and work table made from durable marine plywood. It features spacious storage, a modern stylish design, perfect for dorms, apartments, and small homes. Can be kept closed for a neat look and opened to use as a work/study station.",
  sizes: [
    { id: "small", label: "Small", dimensions: "60 cm × 40 cm", price: 6499 },
    { id: "medium", label: "Medium", dimensions: "70 cm × 45 cm", price: 8199 },
    { id: "large", label: "Large", dimensions: "80 cm × 50 cm", price: 10000 }
  ],
  colors: [
    { id: "White", label: "White", hex: "#F9F9F9" },
    { id: "Brown", label: "Brown", hex: "#5C3D2E" },
    { id: "Black", label: "Black", hex: "#222325" },
    { id: "Wood Grain", label: "Wood Grain", hex: "#C6935E" }
  ],
  gallery: [
    { src: "assets/images/product-open.jpg", alt: "Wallbinet Open Workspace View" },
    { src: "assets/images/promo-overview.jpg", alt: "Wallbinet Features and Closed View" },
    { src: "assets/images/size-color-chart.jpg", alt: "Wallbinet Sizes and Color Options" },
    { src: "assets/images/product-angle.jpg", alt: "Wallbinet Marine Plywood Interior Shelves" }
  ],
  policies: {
    shipping: {
      title: "Shipping & Delivery Policy",
      content: `
        <p><strong>Dispatch Hub:</strong> All Wallbinet units are handcrafted and dispatched directly from our workshop in Sta. Ana, Pampanga.</p>
        <p><strong>Processing Time:</strong> Standard finishes ship within 2–4 business days after order verification. Custom batch orders require 5–7 business days.</p>
        <p><strong>Estimated Transit Times:</strong></p>
        <ul style="margin-left:18px; margin-top:6px;">
          <li>Pampanga & Central Luzon: 1–3 business days</li>
          <li>Metro Manila & CALABARZON: 2–4 business days</li>
          <li>North/South Luzon: 3–6 business days</li>
          <li>Visayas & Mindanao: 6–10 business days via sea/air cargo partner</li>
        </ul>
        <p style="margin-top:10px;">Every order includes a unique tracking number accessible on our Order Tracking portal.</p>
      `
    },
    returns: {
      title: "Return & Exchange Policy",
      content: `
        <p><strong>7-Day Replacement Guarantee:</strong> Customers may request a free replacement or repair within 7 calendar days of delivery for verified manufacturing defects, structural warping, or transit damage.</p>
        <p><strong>Requirements:</strong> Please record an unedited unboxing video upon delivery and contact us at <strong>wallbinetcorp@gmail.com</strong> or <strong>0968-409-6482</strong> with your Order ID.</p>
        <p><strong>Exclusions:</strong> Damage resulting from improper wall mounting, overloading beyond the recommended 25 kg tabletop capacity, or unauthorized modifications is not covered.</p>
      `
    },
    privacy: {
      title: "Privacy & Safety Policy",
      content: `
        <p><strong>Data Collection:</strong> Wallbinet collects only the personal information required to process, verify, and deliver your order (name, verified email address, contact number, and delivery address).</p>
        <p><strong>Email OTP Security:</strong> Every checkout requires one-time email verification to prevent unauthorized orders and protect buyer accounts.</p>
        <p><strong>Confidentiality:</strong> We never sell, rent, or distribute customer records to third-party advertisers.</p>
      `
    },
    contract: {
      title: "Purchase & Installation Contract",
      content: `
        <p><strong>1. Product Specification:</strong> The buyer confirms the selected dimensions (Small 60×40 cm, Medium 70×45 cm, or Large 80×50 cm) and finish (White, Brown, Black, or Wood Grain) made from marine plywood.</p>
        <p><strong>2. Wall Mounting Responsibility:</strong> Each unit includes heavy-duty wall brackets and expansion bolts designed for solid concrete or reinforced stud walls. Installation must be performed securely before placing items on the fold-down desk.</p>
        <p><strong>3. Payment & Fulfillment:</strong> By completing checkout, the buyer authorizes order fulfillment under the selected payment option (GCash, Maya, PayPal, Credit/Debit Card, or Cash on Delivery).</p>
      `
    }
  },
  faqs: [
    {
      q: "Customer Care & Product Maintenance",
      a: "Our support team in Sta. Ana, Pampanga is available Monday to Saturday, 8:00 AM – 6:00 PM via phone (0968-409-6482) or email (wallbinetcorp@gmail.com). Clean your marine plywood cabinet with a soft dry or slightly damp microfiber cloth; avoid harsh chemical solvents."
    },
    {
      q: "Shipping & Delivery Policy",
      a: "Orders ship from Sta. Ana, Pampanga within 2–4 business days. Delivery takes 1–4 days within Pampanga and Metro Manila, and 6–10 days for Visayas and Mindanao. Real-time tracking updates are available using your Order ID."
    },
    {
      q: "Return & Exchange Policy",
      a: "We offer a 7-day replacement guarantee for transit damage or factory defects. Simply send your unboxing video and Order ID to wallbinetcorp@gmail.com within 7 days of receipt."
    },
    {
      q: "Privacy & Safety",
      a: "Your personal details are strictly used for order verification, shipping coordination, and customer service. We enforce OTP email verification on every purchase to ensure buyer safety."
    },
    {
      q: "Wholesale Inquiries",
      a: "We supply bulk orders for student dormitories, condominium developments, schools, and co-working spaces with tiered volume discounts. Use the Wholesale Inquiry form on this page or email wallbinetcorp@gmail.com."
    }
  ]
};

function formatPeso(amount) {
  return "₱" + Number(amount).toLocaleString("en-PH");
}

function getCart() {
  return JSON.parse(localStorage.getItem("wallbinet_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("wallbinet_cart", JSON.stringify(cart));
}

function getOrders() {
  return JSON.parse(localStorage.getItem("wallbinet_orders") || "[]");
}

function saveOrders(orders) {
  localStorage.setItem("wallbinet_orders", JSON.stringify(orders));
}