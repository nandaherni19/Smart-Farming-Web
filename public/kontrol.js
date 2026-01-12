// KONTROL MANUAL (kontrol.html) 
document.addEventListener('DOMContentLoaded', function() {
    // Elemen
    const modeSwitch = document.getElementById("mode-switch");
    const btnOn = document.getElementById("btn-on");
    const btnOff = document.getElementById("btn-off");
    const tandonBar = document.getElementById("tandon-bar");
    const tandonValue = document.getElementById("tandon-value");
    const tandonInfo = document.getElementById("tandon-info");
    const alertBox = document.getElementById("alert-tandon");
    const alertText = document.getElementById("alert-text");
    const statusNow = document.getElementById("status-now");
    const modeStatus = document.getElementById("mode-status"); // tambah elemen ini

    // === 1. STATUS TANDON (SAMA) ===
    firebase.database().ref("smartirrigation/water_level").on("value", snap => {
        const level = snap.val() || 0;
        const percent = Math.min(100, Math.max(0, (level / 25) * 100));

        tandonValue.innerText = Math.round(percent) + "%";
        tandonBar.style.width = percent + "%";

        // warna bar
        if (percent <= 20) tandonBar.style.background = "#e74c3c";
        else if (percent <= 50) tandonBar.style.background = "#f1c40f";
        else tandonBar.style.background = "#3498db";

        // tampilkan info
        if (level <= 5) { // minWaterLevel = 5cm
            tandonInfo.innerText = "⚠ Tandon kosong - Pompa tidak dapat bekerja.";
            alertBox.style.display = "block";
            alertText.innerText = "Air tandon hampir habis (" + level + "cm)!";
        }
        else if (level <= 10) {
            tandonInfo.innerText = "⚠ Level air rendah.";
            alertBox.style.display = "block";
            alertText.innerText = "Air tandon rendah (" + level + "cm).";
        }
        else {
            tandonInfo.innerText = "";
            alertBox.style.display = "none";
        }
    });

    // === 2. BACA STATUS MODE MANUAL (DARI control/manual_mode) ===
    firebase.database().ref("smartirrigation/control/manual_mode").on("value", snap => {
        const isManualMode = snap.val();
        console.log("🔥 Mode manual dari Firebase:", isManualMode);
        
        modeSwitch.checked = isManualMode;
        
        // Update tampilan mode
        if (modeStatus) {
            modeStatus.textContent = isManualMode ? "MANUAL" : "OTOMATIS";
            modeStatus.style.color = isManualMode ? "#e74c3c" : "#27ae60";
        }
        
        // Aktifkan/nonaktifkan tombol kontrol
        if (btnOn && btnOff) {
            if (isManualMode) {
                btnOn.disabled = false;
                btnOff.disabled = false;
                btnOn.style.opacity = "1";
                btnOff.style.opacity = "1";
            } else {
                btnOn.disabled = true;
                btnOff.disabled = true;
                btnOn.style.opacity = "0.5";
                btnOff.style.opacity = "0.5";
            }
        }
    });

    // === 3. UBAH MODE MANUAL ===
    modeSwitch.addEventListener("change", () => {
        const isManual = modeSwitch.checked;
        console.log("🔄 Mengubah mode ke:", isManual ? "MANUAL" : "OTOMATIS");
        
        firebase.database().ref("smartirrigation/control/manual_mode").set(isManual)
            .then(() => {
                console.log("✅ Mode berhasil diubah");
                
                // Jika kembali ke otomatis, matikan pompa manual
                if (!isManual) {
                    firebase.database().ref("smartirrigation/control/manual_pump").set(false)
                        .then(() => console.log("✅ Pompa manual dimatikan (kembali otomatis)"));
                }
            })
            .catch(error => {
                console.error("❌ Gagal mengubah mode:", error);
                alert("Gagal mengubah mode!");
            });
    });

    // === 4. BACA STATUS POMPA ===
    firebase.database().ref("smartirrigation/pump").on("value", snap => {
        const v = snap.val();
        console.log("💧 Status pompa:", v);
        
        if (statusNow) {
            statusNow.innerText = v ? "● AKTIF" : "○ NONAKTIF";
            statusNow.style.color = v ? "#27ae60" : "#e74c3c";
        }
        
        // Update tombol style
        if (btnOn && btnOff) {
            if (v) {
                btnOn.classList.add("btn-on-active");
                btnOff.classList.remove("btn-off-active");
                btnOn.style.backgroundColor = "#27ae60";
                btnOff.style.backgroundColor = "#95a5a6";
            } else {
                btnOff.classList.add("btn-off-active");
                btnOn.classList.remove("btn-on-active");
                btnOff.style.backgroundColor = "#e74c3c";
                btnOn.style.backgroundColor = "#95a5a6";
            }
        }
    });

    // === 5. BACA STATUS POMPA MANUAL (untuk info) ===
    firebase.database().ref("smartirrigation/control/manual_pump").on("value", snap => {
        const manualPump = snap.val();
        console.log("🔧 Pompa manual:", manualPump);
    });

    // === 6. TOMBOL POMPA ON (MANUAL) ===
    btnOn.onclick = () => {
        console.log("🚰 Tombol ON diklik");
        
        // Cek apakah mode manual aktif
        firebase.database().ref("smartirrigation/control/manual_mode").once("value")
            .then(snap => {
                const isManualMode = snap.val();
                
                if (!isManualMode) {
                    alert("Aktifkan Mode Manual terlebih dahulu!");
                    return;
                }
                
                // Cek air tandon sebelum ON
                return firebase.database().ref("smartirrigation/water_level").once("value");
            })
            .then(snap => {
                if (!snap) return; // Jika mode tidak manual
                
                const waterLevel = snap.val();
                console.log("💧 Level air:", waterLevel);
                
                if (waterLevel <= 5) {
                    alert("❌ Tidak bisa mengaktifkan pompa! Level air tandon terlalu rendah.");
                    return;
                }
                
                // Nyalakan pompa manual
                return firebase.database().ref("smartirrigation/control/manual_pump").set(true);
            })
            .then(() => {
                console.log("✅ Pompa manual dinyalakan");
                showToast("Pompa dinyalakan (Mode Manual)", "success");
            })
            .catch(error => {
                console.error("❌ Error menyalakan pompa:", error);
                showToast("Gagal menyalakan pompa", "error");
            });
    };

    // === 7. TOMBOL POMPA OFF (MANUAL) ===
    btnOff.addEventListener("click", () => {
        console.log("🚫 Tombol OFF diklik");
        
        // Cek apakah mode manual aktif
        firebase.database().ref("smartirrigation/control/manual_mode").once("value")
            .then(snap => {
                const isManualMode = snap.val();
                
                if (!isManualMode) {
                    alert("Aktifkan Mode Manual terlebih dahulu!");
                    return;
                }
                
                // Matikan pompa manual
                return firebase.database().ref("smartirrigation/control/manual_pump").set(false);
            })
            .then(() => {
                console.log("✅ Pompa manual dimatikan");
                showToast("Pompa dimatikan (Mode Manual)", "warning");
            })
            .catch(error => {
                console.error("❌ Error mematikan pompa:", error);
                showToast("Gagal mematikan pompa", "error");
            });
    });

    // === 8. FUNGSI TOAST NOTIFICATION ===
    function showToast(message, type = 'info') {
        const toast = document.createElement("div");
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        // Icon berdasarkan type
        let icon = '';
        if (type === 'success') {
            toast.style.backgroundColor = "#27ae60";
            icon = '<i class="fas fa-check-circle"></i>';
        } else if (type === 'warning') {
            toast.style.backgroundColor = "#f39c12";
            icon = '<i class="fas fa-exclamation-triangle"></i>';
        } else if (type === 'error') {
            toast.style.backgroundColor = "#e74c3c";
            icon = '<i class="fas fa-times-circle"></i>';
        } else {
            toast.style.backgroundColor = "#3498db";
            icon = '<i class="fas fa-info-circle"></i>';
        }
        
        toast.innerHTML = icon + message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // === 9. TAMBAH STYLE ANIMASI ===
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .btn-on-active {
            background-color: #27ae60 !important;
            color: white !important;
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
        }
        
        .btn-off-active {
            background-color: #e74c3c !important;
            color: white !important;
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
        }
        
        #mode-status {
            font-weight: bold;
            padding: 4px 12px;
            border-radius: 4px;
            background-color: #f8f9fa;
            display: inline-block;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Kontrol Manual siap!');
});