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
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('medicine_id');
            $table->string('description');
            $table->integer('stock');
            $table->double('dosage');
            $table->date('start_date');
            $table->date('end_date');
            $table->timeTz('reminder_time1');
            $table->timeTz('reminder_time2')->nullable();
            $table->timeTz('reminder_time3')->nullable();
            $table->timeTz('reminder_time4')->nullable();
            $table->timeTz('reminder_time5')->nullable();
            $table->date('restock_reminder')->nullable();
            $table->integer('repeat');
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('medicine_id')
                ->references('id')
                ->on('medicine')
                ->onDelete('cascade');
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
