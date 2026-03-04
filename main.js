// =============================
// CONFIG: ganti sesuai kebutuhan
// =============================
const WA_NUMBER = "6289510168715"; // format internasional tanpa + (Indonesia: 62...)
const BANK_ACCOUNT = "4731648438";
const TARGET = 5000000; // target rupiah
let collected = 650000;

let expense1 = 0;
let expense2 = 0;


// =============================
// UTIL
// =============================
const el = (id) => document.getElementById(id);

const rupiah = (n) =>
  "Rp" + new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0
  }).format(n);

// Extract numeric value from formatted text
function getNumericValue(element) {
  return parseInt(element.textContent.replace(/[^\d]/g, "")) || 0;
}


// =============================
// ANIMATION FUNCTION
// =============================
function animateValue(element, start, end, duration, formatter) {
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;

    const progress = Math.min((currentTime - startTime) / duration, 1);

    // Ease-out cubic (smooth premium feel)
    const eased = 1 - Math.pow(1 - progress, 3);

    const value = Math.round(start + (end - start) * eased);

    element.textContent = formatter ? formatter(value) : value;

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}


// =============================
// MAIN UPDATE FUNCTION
// =============================
function setProgress() {

  const percent = Math.max(
    0,
    Math.min(100, Math.round((collected / TARGET) * 100))
  );

  const balance = collected - (expense1 + expense2);
  const remaining = Math.max(0, TARGET - collected);

  // Animate percentage text
  animateValue(
    el("progressPercent"),
    parseInt(el("progressPercent").textContent) || 0,
    percent,
    800,
    (v) => v + "%"
  );

  // Animate progress bar width
  el("progressBar").style.transition = "width 0.8s ease";
  el("progressBar").style.width = percent + "%";

  // Animate collected
  animateValue(
    el("collectedText"),
    getNumericValue(el("collectedText")),
    collected,
    1000,
    rupiah
  );

  // Animate remaining
  animateValue(
    el("remainingText"),
    getNumericValue(el("remainingText")),
    remaining,
    1000,
    rupiah
  );

  // Animate target
  animateValue(
    el("targetRupiahText"),
    getNumericValue(el("targetRupiahText")),
    TARGET,
    1000,
    rupiah
  );

  // Animate table values
  animateValue(
    el("tableIncome"),
    getNumericValue(el("tableIncome")),
    collected,
    1000,
    rupiah
  );

  animateValue(
    el("tableExpense1"),
    getNumericValue(el("tableExpense1")),
    expense1,
    800,
    rupiah
  );

  animateValue(
    el("tableExpense2"),
    getNumericValue(el("tableExpense2")),
    expense2,
    800,
    rupiah
  );

  animateValue(
    el("tableBalance"),
    getNumericValue(el("tableBalance")),
    balance,
    1000,
    rupiah
  );
}


// =============================
// INITIAL LOAD
// =============================
document.addEventListener("DOMContentLoaded", function () {
  setProgress();
});

function toast(msg){
    el("toastArea").textContent = msg;
    setTimeout(() => { el("toastArea").textContent = ""; }, 3500);
}

function scrollToId(id){
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
}

// =============================
// INIT
// =============================
el("year").textContent = new Date().getFullYear();
el("bankAcc").textContent = BANK_ACCOUNT;

// Smooth scrolling for nav links
document.querySelectorAll('a.nav-link[href^="#"], a.btn[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if(!href || href === "#") return;
    const target = document.querySelector(href);
    if(target){
        e.preventDefault();
        scrollToId(href);
        // close navbar on mobile
        const nav = document.querySelector(".navbar-collapse");
        if(nav.classList.contains("show")){
        new bootstrap.Collapse(nav).toggle();
        }
    }
    });
});

// Paket buttons -> set amount and scroll to donasi
document.querySelectorAll("button[data-amount]").forEach(btn => {
    btn.addEventListener("click", () => {
    const amount = Number(btn.dataset.amount || 0);
    el("donationAmount").value = amount;
    scrollToId("#donasi");
    });
});

// Copy bank account
el("btnCopyAcc").addEventListener("click", async () => {
    try{
    await navigator.clipboard.writeText(BANK_ACCOUNT);
    toast("Nomor rekening berhasil dicopy ✅");
    }catch(err){
    toast("Gagal copy. Silakan blok & copy manual.");
    }
});

// Format button (normalize amount)
el("btnFormat").addEventListener("click", () => {
    const val = Number(el("donationAmount").value || 0);
    if(val <= 0){ toast("Isi nominal dulu ya."); return; }
    // just re-assign to remove weird input
    el("donationAmount").value = Math.round(val);
    toast("Nominal dirapikan: " + rupiah(Math.round(val)));
});

// WhatsApp confirm


// Demo: tambah collected
// el("btnAddCollected").addEventListener("click", () => {
//     const amount = Number(el("donationAmount").value || 0);
//     if(amount <= 0){ toast("Isi nominal dulu untuk simulasi."); return; }
//     collected += amount;
//     setProgress();
//     toast("Simulasi: terkumpul bertambah " + rupiah(amount) + " ✅");
// });

// Transparansi buttons
el("btnDownloadReport").addEventListener("click", () => {
    alert("Placeholder: nanti kamu ganti jadi link laporan (PDF/Drive).");
});
// el("btnUpdateNumbers").addEventListener("click", () => {
//     setProgress();
//     toast("Angka direfresh ✅");
// });