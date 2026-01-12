<?php

use App\Http\Controllers\SensorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// ====== PENTING: letakkan di sini (PUBLIC) ======
Route::post('/sensor/store', [SensorController::class, 'store'])->name('sensor.store');
// ================================================

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () { return view('dashboard'); })->name('dashboard');
    Route::get('/kontrol', function () { return view('kontrol'); })->name('kontrol');
    Route::get('/riwayat', function () { return view('riwayat'); })->name('riwayat');
});

require __DIR__.'/auth.php';