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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();

            // Foreign Key ទៅកាន់ suppliers (ត្រូវប្រាកដថា table suppliers មានរួចហើយ)
            $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade');

            $table->date('order_date');
            $table->date('expected_delivery_date')->nullable();

            // Status: pending, approved, ordered, received, cancelled
            $table->enum('status', ['pending', 'approved', 'ordered', 'received', 'cancelled'])->default('pending');

            // Financials
            $table->decimal('sub_total', 10, 2)->default(0.00);
            $table->decimal('shipping_cost', 10, 2)->default(0.00);
            $table->decimal('tax_rate', 5, 2)->default(0.00); // ឧ. ១០%
            $table->decimal('tax_amount', 10, 2)->default(0.00);
            $table->decimal('grand_total', 10, 2)->default(0.00);

            // Payment
            $table->enum('payment_status', ['unpaid', 'partial', 'paid'])->default('unpaid');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->onDelete('cascade');
            // Additional info
            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
