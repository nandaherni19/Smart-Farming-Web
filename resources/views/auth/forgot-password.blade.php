<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lupa Password - Smart Farming</title>

    <link rel="stylesheet" href="{{ asset('style.css') }}">
</head>

<body class="login-page">

    <div class="card login-box">
        <img src="{{ asset('logo.png') }}" alt="Logo" />

        <h3>Reset Kata Sandi</h3>

        <p class="text-center">Masukkan email untuk menerima link reset password.</p>

        <form method="POST" action="{{ route('password.email') }}">
            @csrf

            @if (session('status'))
                <div class="alert success">{{ session('status') }}</div>
            @endif

            <input type="email" name="email" placeholder="Email" required>

            <button class="btn-login" type="submit">Kirim Link Reset</button>

            <a href="{{ route('login') }}" class="forgot">Kembali ke Login</a>
        </form>

        <div class="login-footer">
            Sistem Monitoring Smart Farming
        </div>
    </div>

</body>

</html>