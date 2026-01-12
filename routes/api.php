<?php
use App\Http\Controllers\SensorController;

Route::post('/sensor', [SensorController::class, 'store']);