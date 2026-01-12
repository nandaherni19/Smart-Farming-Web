<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Smart Farming System - Dashboard</title>

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
        <a class="active" href="{{ url('/dashboard') }}">Dashboard</a>
        <a href="{{ url('/kontrol') }}">Kontrol Manual</a>
        <a href="{{ url('/riwayat') }}">Riwayat</a>
        <a href="{{ route('logout') }}"
        onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
          Logout
        </a>
    </nav>

    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none;">
        @csrf
    </form>
  </header>

  <main class="container">
    <section class="row">

      <div class="card wide">
        <div class="card-title">Level Air Tandon</div>
        <div id="tandon-value" class="tank-value">--%</div>

        <div class="tank-bar">
          <div id="tandon-bar" class="tank-fill"></div>
        </div>

        <div id="tandon-note" class="tank-note">Memuat...</div>
      </div>

      <!-- Status Penyiraman -->
<div class="card wide">
    <div class="card-title">Status Penyiraman</div>
    <div id="pump-status" class="tank-value">TIDAK MENYIRAM</div>
    <div id="pump-info" class="tank-note">Mode: OTOMATIS</div>
    
    <!-- Tombol utama untuk kontrol pompa -->
    <button id="btn-siram" class="btn-primary">
        <i class="fas fa-play-circle"></i> MULAI PENYIRAMAN
    </button>
    
    <!-- Tombol untuk kembali ke otomatis (hanya tampil saat mode manual) -->
    <button id="btn-ke-otomatis" class="btn-secondary" style="display: none; margin-top: 10px;">
        <i class="fas fa-robot"></i> KEMBALI KE OTOMATIS
    </button>
</div>

    </section>

      <!-- ROW 2 : SMALL CARDS -->
    <section class="cards">

      <div class="card small">
        <div class="card-title">Kelembapan Tanah</div>
        <div id="soil-moist" class="card-value">--%</div>
        <div class="desc">Optimal</div>
      </div>

      <div class="card small">
        <div class="card-title">Status Hujan</div>
        <div id="rain-status" class="card-value">--</div>
        <div class="desc">Sensor Hujan aktif</div>
      </div>

      <div class="card small">
        <div class="card-title">Suhu</div>
        <div id="temp" class="card-value">--°C</div>
        <div class="desc">Optimal</div>
      </div>

      <div class="card small">
        <div class="card-title">Temperatur</div>
        <div id="hum" class="card-value">--%</div>
        <div class="desc">Optimal</div>
      </div>
    </section>

    <section class="panels">
      <div class="panel plant">
        <div class="plant-inner">
          <div class="plant-icon">🌿</div>
          <h3 id="plant-health">Sehat</h3>
          <p class="muted">Tanaman dalam kondisi baik</p>

          <div class="progress">
            <div id="progress-bar" class="progress-bar"></div>
            <div id="progress-label" class="progress-label">0%</div>
          </div>
        </div>
      </div>

      <div class="panel chart">
    <h4>Grafik Kelembapan Tanah Real-time</h4>
    <div class="chart-wrap">
        <svg viewBox="0 0 300 140" class="chart-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Background -->
            <rect x="0" y="0" width="300" height="140" fill="#ffffff" rx="6" />
            
            <!-- Grid lines -->
            <line x1="0" y1="20" x2="300" y2="20" stroke="#e9ecef" stroke-width="0.5"/>
            <line x1="0" y1="32" x2="300" y2="32" stroke="#f0f0f0" stroke-width="0.5"/>
            <line x1="0" y1="44" x2="300" y2="44" stroke="#e9ecef" stroke-width="0.5"/>
            <line x1="0" y1="56" x2="300" y2="56" stroke="#f0f0f0" stroke-width="0.5"/>
            <line x1="0" y1="68" x2="300" y2="68" stroke="#e9ecef" stroke-width="0.5"/>
            <line x1="0" y1="80" x2="300" y2="80" stroke="#e9ecef" stroke-width="1"/>
            <line x1="0" y1="92" x2="300" y2="92" stroke="#f0f0f0" stroke-width="0.5"/>
            <line x1="0" y1="104" x2="300" y2="104" stroke="#e9ecef" stroke-width="0.5"/>
            <line x1="0" y1="116" x2="300" y2="116" stroke="#f0f0f0" stroke-width="0.5"/>
            <line x1="0" y1="128" x2="300" y2="128" stroke="#e9ecef" stroke-width="0.5"/>
            <!-- Y-axis labels -->
            <text x="12" y="130" font-size="7" fill="#6c757d" font-weight="500">0%</text>
            <text x="12" y="118" font-size="7" fill="#6c757d" font-weight="500">10%</text>
            <text x="12" y="106" font-size="7" fill="#6c757d" font-weight="500">20%</text>
            <text x="12" y="94" font-size="7" fill="#6c757d" font-weight="500">30%</text>
            <text x="12" y="82" font-size="7" fill="#6c757d" font-weight="500">40%</text>
            <text x="12" y="70" font-size="7" fill="#6c757d" font-weight="500">50%</text>
            <text x="12" y="58" font-size="7" fill="#6c757d" font-weight="500">60%</text>
            <text x="12" y="46" font-size="7" fill="#6c757d" font-weight="500">70%</text>
            <text x="12" y="34" font-size="7" fill="#6c757d" font-weight="500">80%</text>
            <text x="12" y="22" font-size="7" fill="#6c757d" font-weight="500">90%</text>
            <text x="12" y="10" font-size="7" fill="#6c757d" font-weight="500">100%</text>
            
            <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#2aa879" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#2aa879" stop-opacity="0.1"/>
                </linearGradient>
            </defs>
            
            <polyline id="graph-line" fill="url(#areaGradient)" stroke="#2aa879" stroke-width="3" 
                stroke-linejoin="round" stroke-linecap="round"
                points=""/>
            
            <!-- Data Points -->
            <g id="data-points"></g>
            
            <!-- X-axis Label -->
            <text x="150" y="135" font-size="8" fill="#6c757d" text-anchor="middle">Waktu</text>
        </svg>
    </div>
    <div id="time-stamp" class="timestamp">Memulai monitoring real-time...</div>
</div>
    </section>
  </main>
</body>
</html>
  </main>

  <footer class="footer">&copy; Smart Farming System</footer>


  <!-- FIREBASE -->
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

  <script src="{{ asset('firebase-config.js') }}"></script>
  <script src="{{ asset('dashboard.js') }}"></script>

</body>
</html>