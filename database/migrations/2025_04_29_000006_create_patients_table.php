<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 100)->nullable();
            $table->string('phone', 100)->nullable();
            $table->string('emergency_contact', 100)->nullable();
            $table->text('medical_history')->nullable();
            $table->text('condition')->nullable();
            $table->string('status', 100)->default('active');
            $table->foreignId('incident_id')->constrained('incidents')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
