<?php
class Sensor extends Model
{
    use HasFactory;

    protected $fillable = [
        'temperature',
        'humidity',
        'soil_percent',
        'water_level',
        'is_rain',
        'pump',
        'pump_status',
        'manual_mode',
        'mode'
    ];
}