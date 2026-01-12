<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Smart Farming System - Kontrol Manual</title>
<link rel="stylesheet" href="{{ asset('style.css') }}">
</head>

<body>

<header class="topbar">
    <div class="brand">
        <div class="logo">
            <img src="{{ asset('logo.png') }}" alt="logo">
        </div>
        <div class="brand-text">
            <div class="title">Smart Farming System</div>
            <div class="subtitle">Monitoring & Control</div>
        </div>
    </div>

    <nav class="tabs">
        <a href="{{ url('/dashboard') }}">Dashboard</a>
        <a class="active" href="{{ url('/kontrol') }}">Kontrol Manual</a>
        <a href="{{ url('/riwayat') }}">Riwayat</a>
        <a href="{{ route('logout') }}"
        onclick="event.preventDefault(); document.getElementById('logout-form').submit();">LogOut</a>
    </nav>
    <form id="logout-form" method="POST" action="{{ route('logout') }}" style="display:none;">@csrf</form>
</header>


<main class="container">
    <section id="alert-tandon" class="panel" style="display:none; background:#f8d7da; border-left:6px solid #c0392b;">
        <strong style="color:#c0392b;">⚠ PERINGATAN KRITIS:</strong>
        <p id="alert-text">Tandon kosong.</p>
    </section>

    <section class="panel">
        <h3>Status Tandon Air</h3>
        <p>Monitor level air di tandon</p>
        <div class="progress" style="margin-top:10px;">
            <div id="tandon-bar" class="progress-bar" style="width:0%; background:#3498db"></div>
        </div>
        <div style="margin-top:6px; font-weight:bold;">
            Level Air: <span id="tandon-value">0%</span>
        </div>
        <div id="tandon-info" style="margin-top:8px; color:#c0392b; font-size:14px;"></div>
    </section>

    <section class="panel">
        <h3>⚙️ Pengaturan Mode</h3>
        <p>Pilih antara mode otomatis atau kontrol manual</p>
        <div class="mode-box">
            <div class="mode-title">Mode Manual</div>
            <div class="mode-desc">Aktifkan untuk mengontrol pompa dari web</div>
            <label class="switch">
                <input id="mode-switch" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>
    </section>

    <section class="panel">
        <h3>Kontrol Pompa</h3>
        <p>Aktifkan atau matikan pompa air secara manual</p>

        <div class="pump-controls">
            <button class="btn-pump on" id="btn-on">🔘 Aktifkan Pompa</button>
            <button class="btn-pump off" id="btn-off">🛑 Matikan Pompa</button>
        </div>

        <div class="status-now">
            Status Saat Ini:
            <span id="status-now">○ Nonaktif</span>
        </div>
        <div id="pompa-note" style="color:#c0392b; font-size:14px; margin-top:8px;"></div>
    </section>

    <section class="panel" style="background:#eef6ff;">
    <h3>📘 Informasi Sistem</h3>
    <ul style="padding-left:20px; line-height:1.6;">
        <li>
            <b>Mode Otomatis:</b> 
            Pompa akan <b>menyala</b> jika kelembapan tanah berada di bawah 
            <b>batas minimum yang ditentukan (default 21%)</b>, 
            <b>tidak terjadi hujan</b>, dan <b>air tandon tersedia</b>. 
            Pompa akan <b>mati otomatis</b> jika tanah sudah lembap, terdeteksi hujan, 
            atau kondisi kembali normal.
        </li>

        <li>
            <b>Mode Manual:</b> 
            Pengguna dapat menyalakan atau mematikan pompa secara langsung melalui 
            <b>web atau aplikasi mobile</b>. 
            Selama mode manual aktif, <b>logika otomatis tidak dijalankan</b>.
        </li>

        <li>
            <b>Tandon Air:</b> 
            Level air dipantau menggunakan sensor ultrasonik HC-SR04. 
            Jika jarak air melebihi <b>25 cm</b> (tandon habis), 
            maka <b>pompa akan dimatikan secara paksa</b> 
            dan <b>buzzer akan aktif sebagai peringatan</b>.
        </li>

        <li>
            <b>Prioritas Keamanan (Safety Override):</b> 
            Jika air tandon habis, sistem akan <b>mematikan pompa tanpa memandang mode</b> 
            (baik otomatis maupun manual) untuk mencegah kerusakan pompa.
        </li>

        <li>
            <b>Monitoring Real-Time:</b> 
            Data kelembapan tanah, status hujan, suhu, kelembapan udara, level air tandon, 
            serta status pompa dikirim dan disinkronkan secara <b>real-time ke Firebase</b> 
            untuk ditampilkan pada web dan aplikasi mobile.
        </li>
    </ul>
</section>

</main>

<footer class="footer">&copy; Smart Farming System</footer>

<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
<script src="{{ asset('firebase-config.js') }}"></script>
<script src="{{ asset('kontrol.js') }}"></script>
</body>
</html>