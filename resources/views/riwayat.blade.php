<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Smart Farming System - Riwayat</title>
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
    <a href="{{ url('/kontrol') }}">Kontrol Manual</a>
    <a class="active" href="{{ url('/riwayat') }}">Riwayat</a>
    <a href="{{ route('logout') }}" 
    onclick="event.preventDefault(); document.getElementById('logout-form').submit();">LogOut</a>
</nav>
<form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none;">
    @csrf
</form>
</header>


<main class="container">
<section class="panel">
<div class="panel-header">
<h3>📘 Riwayat Data Sensor</h3>
<button class="btn-export" id="export-csv">⬇ Export CSV</button>

<div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #2aa879;">
    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 13px;">
        <div>
            <strong>🔄 Status:</strong> 
            <span id="logger-status" style="color: #e74c3c; font-weight: bold;">Tidak Aktif</span>
        </div>
        <div>
            <strong>⏰ Terakhir Save:</strong> 
            <span id="last-save-time" style="color: #2aa879;">-</span>
        </div>
        <div>
            <strong>📊 Auto-save:</strong> 
            <span style="color: #3498db; font-weight: bold;">Setiap 1 Menit</span>
        </div>
    </div>
</div>

</div>

<p style="margin-bottom: 20px;">Log otomatis dari pembacaan sensor dan status pompa - <strong>Real-time Monitoring</strong></p>

<table class="data-table" id="log-table">
<thead>
<tr>
<th>Waktu & Tanggal</th>
<th>Kelembapan Tanah</th>
<th>Status Pompa</th>
<th>Suhu</th>
<th>Kelembapan Udara</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<p class="table-foot" id="table-footer">Menampilkan entri terbaru</p>
</section>
</main>

<footer class="footer">&copy; Smart Farming System</footer>

<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
<script src="{{ asset('firebase-config.js') }}"></script>
<script src="{{ asset('riwayat.js') }}"></script>
</body>
</html>