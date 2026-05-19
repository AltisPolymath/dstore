(function () {
  var PRODUCT_NAMES = {
    "word-essentials": "Word Essentials",
    "excel-power-user": "Excel Power User",
    "outlook-inbox": "Outlook Inbox Mastery",
    "powerpoint-pro": "PowerPoint Presenter Pro",
    "teams-onenote": "Teams & OneNote Suite",
    "m365-complete": "Microsoft 365 Complete",
  };

  var PAYMENT_LABELS = {
    card: "Card",
    alipay: "Alipay",
    wechat: "WeChat Pay",
  };

  var PAYMENT_BTN_LABELS = {
    card: "Pay now",
    alipay: "Pay with Alipay",
    wechat: "Pay with WeChat Pay",
  };

  var CARD_FIELDS = ["card-name", "card-number", "expiry", "cvc"];

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function formatEuro(amount) {
    return "€" + amount.toFixed(2).replace(".", ",");
  }

  function getSelectedPaymentMethod() {
    var selected = document.querySelector('input[name="paymentMethod"]:checked');
    return selected ? selected.value : "card";
  }

  function initCheckoutSummary() {
    var productKey = getQueryParam("product") || "m365-complete";
    var price = parseFloat(getQueryParam("price"), 10) || 70;
    if (isNaN(price)) price = 70;

    var name = PRODUCT_NAMES[productKey] || "OfficeFlow Guide";
    var subtotal = price;
    var vat = subtotal * 0.19;
    var total = subtotal + vat;

    var elProduct = document.getElementById("summary-product");
    var elSubtotal = document.getElementById("summary-subtotal");
    var elVat = document.getElementById("summary-vat");
    var elTotal = document.getElementById("summary-total");

    if (elProduct) elProduct.textContent = name;
    if (elSubtotal) elSubtotal.textContent = formatEuro(subtotal);
    if (elVat) elVat.textContent = formatEuro(vat);
    if (elTotal) elTotal.textContent = formatEuro(total);
  }

  function setCardFieldsRequired(required) {
    CARD_FIELDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (required) {
        el.setAttribute("required", "");
      } else {
        el.removeAttribute("required");
      }
    });
  }

  function updatePaymentUI(method) {
    var panels = {
      card: document.getElementById("payment-panel-card"),
      alipay: document.getElementById("payment-panel-alipay"),
      wechat: document.getElementById("payment-panel-wechat"),
    };

    Object.keys(panels).forEach(function (key) {
      var panel = panels[key];
      if (!panel) return;
      var active = key === method;
      panel.hidden = !active;
      panel.classList.toggle("payment-panel--hidden", !active);
    });

    setCardFieldsRequired(method === "card");

    var summaryMethod = document.getElementById("summary-method");
    if (summaryMethod) {
      summaryMethod.textContent = PAYMENT_LABELS[method] || method;
    }

    var payBtn = document.getElementById("pay-btn");
    if (payBtn && !payBtn.disabled) {
      payBtn.textContent = PAYMENT_BTN_LABELS[method] || "Pay now";
    }

    var payBtnDefault = PAYMENT_BTN_LABELS[method] || "Pay now";
    if (payBtn) {
      payBtn.dataset.defaultLabel = payBtnDefault;
    }
  }

  function initPaymentMethodSwitcher() {
    var radios = document.querySelectorAll('input[name="paymentMethod"]');
    if (!radios.length) return;

    radios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        updatePaymentUI(radio.value);
      });
    });

    updatePaymentUI(getSelectedPaymentMethod());
  }

  function initCheckoutForm() {
    var form = document.getElementById("checkout-form");
    var errorBanner = document.getElementById("payment-error");
    var payBtn = document.getElementById("pay-btn");

    if (!form || !errorBanner) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      updatePaymentUI(getSelectedPaymentMethod());

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var method = getSelectedPaymentMethod();
      var defaultLabel =
        (payBtn && payBtn.dataset.defaultLabel) ||
        PAYMENT_BTN_LABELS[method] ||
        "Pay now";

      if (payBtn) {
        payBtn.disabled = true;
        payBtn.textContent = "Processing…";
      }

      setTimeout(function () {
        errorBanner.classList.add("visible");
        errorBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });

        if (payBtn) {
          payBtn.disabled = false;
          payBtn.textContent = defaultLabel;
        }
      }, 900);
    });
  }

  if (document.getElementById("checkout-form")) {
    initCheckoutSummary();
    initPaymentMethodSwitcher();
    initCheckoutForm();
  }
})();
