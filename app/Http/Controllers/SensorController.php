<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sensor;

class SensorController extends Controller
{
    public function store(Request $request)
    {
        $sensor = new Sensor();
        $sensor->temperature = $request->temperature;
        $sensor->humidity = $request->humidity;
        $sensor->soil_percent = $request->soil_percent;
        $sensor->water_level = $request->water_level;
        $sensor->is_rain = $request->is_rain;
        $sensor->pump = $request->pump;
        $sensor->pump_status = $request->pump_status;
        $sensor->manual_mode = $request->manual_mode;
        $sensor->mode = $request->mode;
        $sensor->save();

        return response()->json(['status' => 'ok']);
    }
}
