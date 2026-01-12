<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Daftar - Smart Farming</title>

    <link rel="stylesheet" href="{{ asset('style.css') }}">
</head>

<body class="login-page">

    <div class="card login-box">
        <img src="{{ asset('logo.png') }}" alt="Logo" />

        <h3>Buat Akun Baru</h3>

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <input type="text" name="name" placeholder="Nama Lengkap" required>

            <input type="email" name="email" placeholder="Email" required>

            <input type="password" name="password" placeholder="Password" required>

            <input type="password" name="password_confirmation" placeholder="Konfirmasi Password" required>

            <button class="btn-login" type="submit">Daftar</button>

            <a href="{{ route('login') }}" class="forgot">Sudah punya akun? Login</a>
        </form>

        <div class="login-footer">
            Sistem Monitoring Smart Farming
        </div>
    </div>

</body>

</html>
