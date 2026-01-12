<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reset Password - Smart Farming</title>

    <link rel="stylesheet" href="{{ asset('style.css') }}">
</head>

<body class="login-page">

    <div class="card login-box">
        <img src="{{ asset('logo.png') }}" alt="Logo" />

        <h3>Buat Password Baru</h3>

        <form method="POST" action="{{ route('password.store') }}">
            @csrf

            <input type="hidden" name="token" value="{{ $request->route('token') }}">

            <input type="email" name="email" value="{{ old('email', $request->email) }}" required>

            <input type="password" name="password" placeholder="Password Baru" required>

            <input type="password" name="password_confirmation" placeholder="Konfirmasi Password" required>

            <button class="btn-login" type="submit">Reset Password</button>

            <a href="{{ route('login') }}" class="forgot">Kembali ke Login</a>
        </form>

        <div class="login-footer">
            Sistem Monitoring Smart Farming
        </div>
    </div>

</body>

</html>