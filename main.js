// =============================
// CONFIG: ganti sesuai kebutuhan
// =============================
const WA_NUMBER = "6289510168715"; // format internasional tanpa + (Indonesia: 62...)
const BANK_ACCOUNT = "4731648438";
const TARGET = 5000000; // target rupiah
let collected = 0; // terkumpul (update manual / demo tombol)

// Optional: contoh pengeluaran (buat tabel transparansi)
let expense1 = 0; // belanja sembako
let expense2 = 0; // uang saku
let expense3 = 0; // operasional

// =============================
// UTIL
// =============================
const el = (id) => document.getElementById(id);
const rupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

function toast(msg){
    el("toastArea").textContent = msg;
    setTimeout(() => { el("toastArea").textContent = ""; }, 3500);
}

function setProgress(){
    const percent = Math.max(0, Math.min(100, Math.round((collected / TARGET) * 100)));
    el("progressBar").style.width = percent + "%";
    el("progressPercent").textContent = percent + "%";
    el("collectedText").textContent = rupiah(collected);
    el("remainingText").textContent = rupiah(Math.max(0, TARGET - collected));
    el("targetRupiahText").textContent = rupiah(TARGET);

    // table
    el("tableIncome").textContent = rupiah(collected);
    el("tableExpense1").textContent = rupiah(expense1);
    el("tableExpense2").textContent = rupiah(expense2);
    el("tableExpense3").textContent = rupiah(expense3);
    el("tableBalance").textContent = rupiah(collected - (expense1 + expense2 + expense3));
}

function scrollToId(id){
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
}

// =============================
// INIT
// =============================
el("year").textContent = new Date().getFullYear();
el("bankAcc").textContent = BANK_ACCOUNT;
el("waDisplay").textContent = "+" + WA_NUMBER;
setProgress();

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