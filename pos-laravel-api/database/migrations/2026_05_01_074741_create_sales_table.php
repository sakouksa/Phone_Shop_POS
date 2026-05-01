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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();

            // Foreign Keys
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();

            // Financials
            $table->decimal('sub_total', 10, 2);
            $table->decimal('discount', 10, 2)->default(0.00);
            $table->decimal('tax_amount', 10, 2)->default(0.00);
            $table->decimal('grand_total', 10, 2);

            // Payment
            $table->decimal('amount_received', 10, 2);
            $table->decimal('change', 10, 2)->default(0.00);
            $table->enum('payment_method', ['cash', 'bank_transfer', 'card', 'split'])->default('cash');

            $table->enum('status', ['completed', 'pending', 'cancelled'])->default('completed');

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
