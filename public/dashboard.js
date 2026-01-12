// DASHBOARD REAL-TIME
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard loaded');
    
    // Kirim data ke MySQL
    firebase.database().ref("smartirrigation").on("value", snapshot => {
        if (!snapshot.exists()) {
            console.log("Firebase kosong!");
            return;
        }

        let d = snapshot.val();

        fetch("/sensor/store", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name=csrf-token]').content
            },
            body: JSON.stringify({
                temperature: d.temperature ?? null,
                humidity: d.humidity ?? null,
                soil_percent: d.soil_percent ?? null,
                water_level: d.water_level ?? null,
                is_rain: d.is_rain ?? null,
                pump: d.pump ?? null,
                pump_status: d.pump,
                manual_mode: d.control?.manual_mode ?? 0,
                mode: d.control?.manual_mode ? "manual" : "auto"
            })
        })
        .then(res => res.json())
        .then(data => console.log("Data masuk MySQL:", data))
        .catch(err => console.error(err));
    });

    // Variabel untuk grafik
    let soilMoistureHistory = [];
    const maxDataPoints = 10;
    
    // === 1. INIT GRAFIK ===
    function initializeChart() {
        console.log('📊 Initializing chart...');
        soilMoistureHistory = [];
        updateChart();
        updateTimestamp();
    }
    
    // === 2. UPDATE GRAFIK ===
    function updateChart() {
        const graphLine = document.getElementById('graph-line');
        if (!graphLine) return;
        
        const svgWidth = 300;
        
        if (soilMoistureHistory.length === 0) {
            graphLine.setAttribute('points', '');
            updateTimestamp('Menunggu data sensor...');
            return;
        }
        
        let points = '';
        const dataCount = soilMoistureHistory.length;
        
        soilMoistureHistory.forEach((value, index) => {
            const x = 10 + (index * (svgWidth - 20) / Math.max(1, dataCount - 1));
            const y = 20 + (100 - value) * 1.0;
            points += `${x},${y} `;
        });
        
        graphLine.setAttribute('points', points.trim());
        console.log('📈 Chart updated with', soilMoistureHistory.length, 'data points');
    }
    
    // === 3. ADD DATA TO CHART ===
    function addToChart(soilMoisture) {
        if (soilMoisture === null || soilMoisture === undefined || isNaN(soilMoisture)) {
            return;
        }
        
        const moistureValue = Number(soilMoisture);
        soilMoistureHistory.push(moistureValue);
        
        if (soilMoistureHistory.length > maxDataPoints) {
            soilMoistureHistory = soilMoistureHistory.slice(-maxDataPoints);
        }
        
        updateChart();
        updateTimestamp();
    }
    
    function updateTimestamp(message) {
        const timeElement = document.getElementById('time-stamp');
        if (timeElement) {
            if (message) {
                timeElement.textContent = message;
            } else {
                timeElement.textContent = 'Update: ' + new Date().toLocaleTimeString('id-ID');
            }
        }
    }
    
    // === 4. SOIL MOISTURE dengan GRAFIK ===
    firebase.database().ref("smartirrigation/soil_percent").on("value", s => {
        const v = s.val();
        if (v !== null) {
            document.getElementById("soil-moist").innerText = v + "%";
            document.getElementById("progress-bar").style.width = v + "%";
            document.getElementById("progress-label").innerText = v + "%";
            
            updatePlantHealth(v);
            addToChart(v);
        }
    });
    
    // === 5. UPDATE PLANT HEALTH ===
    function updatePlantHealth(soilMoisture) {
        const healthElement = document.getElementById("plant-health");
        const descElement = document.querySelector('.muted');
        
        if (!healthElement || !descElement) return;
        
        if (soilMoisture < 30) {
            healthElement.textContent = "Kering";
            healthElement.style.color = "#e74c3c";
            descElement.textContent = "Tanaman butuh penyiraman";
        } else if (soilMoisture < 60) {
            healthElement.textContent = "Sehat";
            healthElement.style.color = "#27ae60";
            descElement.textContent = "Tanaman dalam kondisi baik";
        } else {
            healthElement.textContent = "Lembab";
            healthElement.style.color = "#3498db";
            descElement.textContent = "Tanaman cukup air";
        }
    }

    // === 6. TEMPERATURE ===
    firebase.database().ref("smartirrigation/temperature").on("value", s => {
        const temp = s.val();
        if (temp !== null) {
            document.getElementById("temp").innerText = temp + "°C";
        }
    });

    // === 7. HUMIDITY ===
    firebase.database().ref("smartirrigation/humidity").on("value", s => {
        const hum = s.val();
        if (hum !== null) {
            document.getElementById("hum").innerText = hum + "%";
        }
    });

    // === 8. RAIN SENSOR - DIPERBAIKI ===
    firebase.database().ref("smartirrigation/is_rain").on("value", function(snapshot) {
        const value = snapshot.val();
        const rainElement = document.getElementById("rain-status");
        
        if (!rainElement) return;
        
        console.log("🌧 Rain sensor:", value, "(0=TIDAK HUJAN, 1=HUJAN)");
        
        // Arduino: 0 = tidak hujan, 1 = hujan
        if (value === 1) {
            // 1 = HUJAN
            rainElement.innerHTML = 'HUJAN';
            rainElement.style.color = "#3498db";
            rainElement.style.backgroundColor = "#e3f2fd";
        } 
        else if (value === 0) {
            // 0 = TIDAK HUJAN
            rainElement.innerHTML = 'TIDAK HUJAN';
            rainElement.style.color = "#f39c12";
            rainElement.style.backgroundColor = "#fff3cd";
        }
        else {
            rainElement.innerHTML = 'OFFLINE';
            rainElement.style.color = "#95a5a6";
            rainElement.style.backgroundColor = "#f8f9fa";
        }
    });
    
    // === 9. PUMP STATUS (DARI ARDUINO) ===
    firebase.database().ref("smartirrigation/pump").on("value", s => {
        const p = s.val();
        if (p !== null) {
            console.log('💧 Pump status:', p);
            updatePumpDisplay(p);
        }
    });
    
    // === 10. MODE MANUAL ===
    firebase.database().ref("smartirrigation/control/manual_mode").on("value", s => {
        const manualMode = s.val();
        const modeElement = document.getElementById("mode-status");
        
        if (modeElement) {
            if (manualMode) {
                modeElement.innerHTML = 'MANUAL';
                modeElement.style.color = "#e74c3c";
                modeElement.style.backgroundColor = "#fdeaea";
            } else {
                modeElement.innerHTML = 'OTOMATIS';
                modeElement.style.color = "#27ae60";
                modeElement.style.backgroundColor = "#eafaf1";
            }
        }
    });
    
    // === 11. PUMP MODE INFO ===
    firebase.database().ref("smartirrigation/pump_mode").on("value", s => {
        const mode = s.val();
        const infoElement = document.getElementById("pump-info");
        
        if (infoElement && mode) {
            infoElement.textContent = "Mode: " + mode;
        }
    });
    
    // === 12. WATER LEVEL ===
    firebase.database().ref("smartirrigation/water_level").on("value", s => {
        const level = s.val();
        if (level !== null) {
            const percent = Math.min(100, Math.max(0, (level / 25) * 100));
            document.getElementById("tandon-value").innerText = Math.round(percent) + "%";
            document.getElementById("tandon-bar").style.width = percent + "%";
            
            const noteElement = document.getElementById("tandon-note");
            if (level <= 5) {
                noteElement.innerHTML = '⚠ Tandon hampir habis!';
                noteElement.style.color = "#e74c3c";
            } else if (level <= 10) {
                noteElement.innerHTML = '⚠ Level air rendah';
                noteElement.style.color = "#f39c12";
            } else {
                noteElement.innerHTML = '✓ Level air normal';
                noteElement.style.color = "#27ae60";
            }
        }
    });

    // === 13. BUTTON CONTROL - VERSI IMPROVED ===
    const btnSiram = document.getElementById("btn-siram");
    if (btnSiram) {
        btnSiram.addEventListener("click", async () => {
            console.log('🚰 Tombol siram diklik');
            
            try {
                // Cek mode manual dulu
                const modeSnap = await firebase.database().ref("smartirrigation/control/manual_mode").once("value");
                const isManualMode = modeSnap.val();
                
                if (!isManualMode) {
                    // TANYAKAN dulu ke user apakah ingin ubah ke mode manual
                    const userConfirmed = confirm(
                        "Saat ini sistem dalam mode OTOMATIS.\n" +
                        "Untuk mengontrol pompa, sistem harus diubah ke mode MANUAL.\n\n" +
                        "Apakah Anda ingin mengubah ke mode MANUAL?"
                    );
                    
                    if (!userConfirmed) {
                        console.log('❌ User membatalkan');
                        showToast('Pembatalan: tetap mode otomatis', 'warning');
                        return;
                    }
                    
                    // Ubah ke mode manual
                    await firebase.database().ref("smartirrigation/control/manual_mode").set(true);
                    console.log('✅ Mode diubah ke MANUAL');
                    showToast('Sistem diubah ke Mode Manual', 'success');
                }
                
                // Sekarang toggle pompa manual
                const pumpSnap = await firebase.database().ref("smartirrigation/control/manual_pump").once("value");
                const currentState = pumpSnap.val();
                const newState = !currentState;
                
                await firebase.database().ref("smartirrigation/control/manual_pump").set(newState);
                console.log('✅ Manual pump updated to:', newState);
                
                // Tampilkan pesan yang berbeda
                if (newState) {
                    showToast('Pompa dinyalakan (Mode Manual)', 'success');
                    
                    // Konfirmasi apakah ingin kembali ke otomatis setelah selesai
                    setTimeout(() => {
                        const returnAuto = confirm(
                            "Pompa sedang menyiram dalam mode MANUAL.\n\n" +
                            "Ingin kembali ke mode OTOMATIS setelah selesai?\n" +
                            "(Klik OK untuk kembali otomatis, Cancel untuk tetap manual)"
                        );
                        
                        if (returnAuto) {
                            // Set timer untuk kembali otomatis setelah 5 menit
                            setTimeout(() => {
                                firebase.database().ref("smartirrigation/control/manual_mode").set(false);
                                firebase.database().ref("smartirrigation/control/manual_pump").set(false);
                                showToast('Kembali ke Mode Otomatis', 'info');
                            }, 300000); // 5 menit
                        }
                    }, 2000);
                    
                } else {
                    showToast('Pompa dimatikan (Mode Manual)', 'warning');
                }
                
            } catch (error) {
                console.error('❌ Error:', error);
                showToast('Gagal mengontrol pompa: ' + error.message, 'error');
            }
        });
    }
    
    // === 14. UPDATE PUMP DISPLAY ===
    function updatePumpDisplay(pumpState) {
        const pumpElement = document.getElementById("pump-status");
        const btnSiram = document.getElementById("btn-siram");
        
        if (!pumpElement) return;
        
        if (pumpState === 1) { // POMPA NYALA
            pumpElement.innerHTML = 'SEDANG MENYIRAM';
            pumpElement.style.color = "#27ae60";
            pumpElement.style.backgroundColor = "#d5f4e6";
            pumpElement.style.padding = "10px";
            pumpElement.style.borderRadius = "8px";
            pumpElement.style.fontWeight = "bold";
            
            if (btnSiram) {
                btnSiram.innerHTML = 'HENTIKAN';
                btnSiram.style.backgroundColor = "#e74c3c";
                btnSiram.style.color = "white";
            }
            
        } else { // POMPA MATI
            pumpElement.innerHTML = 'TIDAK MENYIRAM';
            pumpElement.style.color = "#95a5a6";
            pumpElement.style.backgroundColor = "#f8f9fa";
            pumpElement.style.padding = "10px";
            pumpElement.style.borderRadius = "8px";
            pumpElement.style.fontWeight = "bold";
            
            if (btnSiram) {
                btnSiram.innerHTML = 'SIRAM';
                btnSiram.style.backgroundColor = "#27ae60";
                btnSiram.style.color = "white";
            }
        }
    }
    
    // === 15. TOAST NOTIFICATION ===
    function showToast(message, type = 'info') {
        // Hapus toast sebelumnya jika ada
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement("div");
        toast.className = "custom-toast";
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
        `;
        
        // Icon berdasarkan type
        let icon = '';
        if (type === 'success') {
            toast.style.backgroundColor = "#27ae60";
            icon = '✓';
        } else if (type === 'warning') {
            toast.style.backgroundColor = "#f39c12";
            icon = '⚠';
        } else if (type === 'error') {
            toast.style.backgroundColor = "#e74c3c";
            icon = '✗';
        } else {
            toast.style.backgroundColor = "#3498db";
            icon = 'ℹ';
        }
        
        toast.innerHTML = `<span style="font-size: 18px;">${icon}</span> ${message}`;
        document.body.appendChild(toast);
        
        // Auto remove setelah 5 detik
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    // === 16. STYLE ANIMASI Tambahan===
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        #pump-status, #mode-status {
            padding: 10px;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
            transition: all 0.3s ease;
        }
        
        #btn-siram {
            margin-top: 15px;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            font-size: 16px;
        }
        
        #btn-siram:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        #btn-siram:active {
            transform: translateY(0);
        }
        
        .card-value {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .tank-note, #pump-info {
            font-size: 14px;
            color: #6c757d;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
    
    // === 17. INITIALIZE ===
    initializeChart();
    
    console.log('✅ Dashboard fully initialized');
});