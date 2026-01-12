<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Login - Smart Farming</title>
  <link rel="stylesheet" href="{{ asset('style.css') }}">
</head>

<body class="login-page">
  <div class="card login-box">
    <img src="{{ asset('logo.png') }}" alt="Logo"/>
    <h3>Masuk ke Dashboard Anda</h3>
    <form method="POST" action="{{ route('login') }}">
        @csrf
        <input id="email" name="email" type="email" placeholder="Email" required />
        <input id="password" name="password" type="password" placeholder="Kata Sandi" required />
        <button type="submit" class="btn-login">Masuk</button>
    </form>
    <!-- TOMBOL REGISTER
    <div class="login-footer">
        Belum punya akun?
        <a href="{{ route('register') }}" style="color: var(--accent); font-weight:600;">
            Daftar
        </a>
    </div> -->
    <div class="login-footer">Sistem Monitoring Smart Farming</div>
  </div>

</body>
</html>