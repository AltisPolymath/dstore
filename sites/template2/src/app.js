(function () {
  var PLAN_NAMES = {
    essentials: "Essentials",
    fluency: "Fluency",
    polyglot: "Polyglot",
  };

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function formatEuro(amount) {
    return "€" + amount.toFixed(2).replace(".", ",");
  }

  function initContactButtons() {
    document.querySelectorAll(".contact-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });
  }

  function initCheckoutSummary() {
    var planKey = getQueryParam("plan") || "fluency";
    var price = parseFloat(getQueryParam("price"), 10) || 199;
    if (isNaN(price)) price = 199;

    var name = PLAN_NAMES[planKey] || "LinguaFlow Course";
    var subtotal = price;
    var vat = subtotal * 0.19;
    var total = subtotal + vat;

    var elPlan = document.getElementById("summary-plan");
    var elSubtotal = document.getElementById("summary-subtotal");
    var elVat = document.getElementById("summary-vat");
    var elTotal = document.getElementById("summary-total");

    if (elPlan) elPlan.textContent = name;
    if (elSubtotal) elSubtotal.textContent = formatEuro(subtotal);
    if (elVat) elVat.textContent = formatEuro(vat);
    if (elTotal) elTotal.textContent = formatEuro(total);
  }

  function initCheckoutForm() {
    var form = document.getElementById("checkout-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var btn = document.getElementById("enroll-btn");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Submitted";
      }
    });
  }

  initContactButtons();

  if (document.getElementById("checkout-form")) {
    initCheckoutSummary();
    initCheckoutForm();
  }
})();
