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
        Schema::create('exchanges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->string('old_phone_model');
            $table->string('old_phone_imei');
            $table->decimal('estimated_value', 10, 2);
            $table->foreignId('new_product_id')->constrained('products')->onDelete('cascade');
            $table->decimal('additional_fee', 10, 2);
            $table->enum('status', ['completed', 'pending'])->default('completed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exchanges');
    }
};
