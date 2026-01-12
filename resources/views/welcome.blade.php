<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Farming System</title>
    <link rel="stylesheet" href="/welcome-style.css">
</head>

<body>
    <header class="hero">
        <nav class="navbar">
            <div class="logo-text">SmartFarm</div>

            <div class="nav-links">
                <a href="{{ route('login') }}" class="btn-login">Login</a>
                <!-- <a href="{{ route('register') }}" class="btn-reg">Register</a> -->
            </div>
        </nav>
        <div class="hero-content">
            <div class="hero-text">
                <h1>Smart Farming for Your Modern Agriculture</h1>
                <p>
                    Sistem monitoring tanaman berbasis IoT untuk memantau kelembapan tanah, suhu,
                    dan kondisi tanaman secara real-time.
                </p>

                <a href="{{ route('login') }}" class="btn-start">Mulai Sekarang</a>
            </div>

            <div class="hero-img">
                <img src="/pump.jpg" alt="smart farming">
            </div>
        </div>
    </header>

    <section class="features">
        <h2>Fitur Smart Farming</h2>

        <div class="feature-cards">

            <div class="card">
                <img src="/soil.jpg" alt="soil sensor">
                <h3>Monitoring Kelembapan Tanah</h3>
                <p>Membantu mendeteksi kondisi tanah secara akurat.</p>
            </div>

            <div class="card">
                <img src="/temp.jpg" alt="temperature">
                <h3>Monitoring Suhu & Kelembapan</h3>
                <p>Pantau perubahan lingkungan secara real-time.</p>
            </div>

            <div class="card">
                <img src="/raindrop.jpg" alt="raindrop">
                <h3>Monitoring Curah Hujan</h3>
                <p>Deteksi presensi dan intensitas hujan secara real-time.</p>
            </div>

            <div class="card">
                <img src="/temp2.jpg" alt="pump control">
                <h3>Kontrol Pompa Air</h3>
                <p>Aktifkan dan matikan pompa otomatis atau manual.</p>
            </div>

        </div>
    </section>

    <section class="about">
        <div class="about-grid">

            <div class="about-img">
                <img src="/smart-farming.jpg" alt="farmer">
            </div>

            <div class="about-text">
                <h2>Apa itu Smart Farming?</h2>
                <p>
                    Smart Farming membantu petani mengoptimalkan penyiraman tanaman dengan
                    memanfaatkan sensor IoT, sehingga lebih efisien dan akurat.
                </p>

                <ul>
                    <li>Penggunaan air lebih hemat</li>
                    <li>Deteksi otomatis kelembapan kritis</li>
                    <li>Histori data penyiraman lengkap</li>
                </ul>
            </div>

        </div>
    </section>

    <section class="testimoni">
        <h2>Testimoni</h2>

        <div class="testi-card">
            <p>"Semenjak menggunakan Smart Farming, saya lebih hemat air dan tanaman lebih sehat."</p>
            <strong>- Pengguna Sistem</strong>
        </div>
    </section>

    <footer>
        <p>© Smart Farming System</p>
    </footer>

</body>
</html>