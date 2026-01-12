<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sensors', function (Blueprint $table) {
            $table->id();
            
            $table->string('role')->default('petani');

            $table->float('temperature');
            $table->integer('humidity');
            $table->integer('soil_percent');
            $table->integer('water_level');

            $table->boolean('is_rain');
            $table->boolean('pump');
            $table->boolean('pump_status');
            $table->boolean('manual_mode');

            $table->enum('mode', ['auto', 'manual']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sensors');
    }
};