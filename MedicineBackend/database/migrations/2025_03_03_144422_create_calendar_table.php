<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('calendar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicine_id')->constrained('medicine')->onDelete('cascade');
            $table->string('name');
            $table->string('description');
            $table->integer('stock');
            $table->double('dosage');
            $table->date('start_date');
            $table->date('end_date');
            $table->timeTz('reminder_time1');
            $table->timeTz('reminder_time2');
            $table->timeTz('reminder_time3');
            $table->timeTz('reminder_time4');
            $table->timeTz('reminder_time5');
            $table->date('restock_reminder');
            $table->integer('repeat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar');
    }
};
