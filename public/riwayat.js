// ===============================
// RIWAYAT.JS - FINAL BERSIH
// ===============================

// GLOBAL STATE
let autoLoggerInterval;
let realTimeUpdateInterval;

// ===============================
// SIMPAN DATA (MANUAL / AUTO)
// ===============================
function saveCurrentState() {
    if (!firebase.apps.length) {
        alert('Firebase belum siap');
        return;
    }

    firebase.database().ref('smartirrigation').once('value')
        .then(snapshot => {
            const data = snapshot.val();
            if (!data) return;

            const now = new Date();
            const logEntry = {
                time: now.toLocaleString('id-ID'),
                timestamp: now.getTime(), // 🔑 KUNCI
                soil_percent: data.soil_percent || 0,
                pump: data.pump || false,
                temperature: data.temperature || 0,
                humidity: data.humidity || 0,
                is_rain: data.is_rain || false,
                mode: data.mode || 'auto',
                water_level: data.water_level || 0
            };

            return firebase.database()
                .ref('smartirrigation/logs')
                .push(logEntry);
        })
        .then(() => updateLastSaveTime())
        .catch(err => alert('Gagal simpan: ' + err.message));
}

// ===============================
// DATA TEST
// ===============================
function addTestData() {
    const now = new Date();
    const testData = {
        time: now.toLocaleString('id-ID'),
        timestamp: now.getTime(),
        soil_percent: Math.floor(Math.random() * 100),
        pump: Math.random() > 0.5,
        temperature: (20 + Math.random() * 15).toFixed(1),
        humidity: Math.floor(30 + Math.random() * 50),
        is_rain: Math.random() > 0.7,
        mode: Math.random() > 0.5 ? 'auto' : 'manual',
        water_level: Math.floor(Math.random() * 25)
    };

    firebase.database().ref('smartirrigation/logs').push(testData);
}

// ===============================
// AUTO LOGGER (1 MENIT)
// ===============================
function startAutoLogger() {
    if (autoLoggerInterval) clearInterval(autoLoggerInterval);

    autoLoggerInterval = setInterval(saveCurrentState, 60000);
    saveCurrentState();
}

// ===============================
// LOAD DATA RIWAYAT
// ===============================
function loadRiwayat() {
    firebase.database()
        .ref('smartirrigation/logs')
        .limitToLast(20)
        .once('value')
        .then(snapshot => updateTable(snapshot.val()));
}

// ===============================
// UPDATE TABEL (FIX URUTAN)
// ===============================
function updateTable(data) {
    const tbody = document.querySelector('#log-table tbody');
    tbody.innerHTML = '';

    if (!data) {
        tbody.innerHTML = `<tr><td colspan="5" align="center">Belum ada data</td></tr>`;
        return;
    }

    const logs = Object.values(data)
        .map(d => ({
            ...d,
            timestamp: d.timestamp || 0
        }))
        .sort((a, b) => b.timestamp - a.timestamp); // 🔥 BENAR

    logs.forEach((log, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                ${log.time}
                ${index === 0 ? '<span style="color:white;background:#2aa879;padding:2px 6px;border-radius:8px;font-size:10px;">BARU</span>' : ''}
            </td>
            <td>${log.soil_percent}%</td>
            <td>${log.pump ? 'ON' : 'OFF'}</td>
            <td>${log.temperature}°C</td>
            <td>${log.humidity}%</td>
        `;
        tbody.appendChild(tr);
    });
}

// ===============================
// CSV EXPORT (URUT BENAR)
// ===============================
function exportToCSV() {
    firebase.database().ref('smartirrigation/logs').once('value')
        .then(snapshot => {
            const data = snapshot.val();
            if (!data) return;

            const logs = Object.values(data)
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            let csv = 'Waktu,Soil(%),Pompa,Suhu,Humidity\n';
            logs.forEach(l => {
                csv += `"${l.time}",${l.soil_percent},${l.pump ? 'ON' : 'OFF'},${l.temperature},${l.humidity}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'riwayat.csv';
            a.click();
        });
}

// ===============================
// INFO WAKTU
// ===============================
function updateLastSaveTime() {
    const el = document.getElementById('last-save-time');
    if (el) el.textContent = new Date().toLocaleTimeString('id-ID');
}

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    loadRiwayat();
    startAutoLogger();
    setInterval(loadRiwayat, 10000); // refresh tabel 10 detik
});