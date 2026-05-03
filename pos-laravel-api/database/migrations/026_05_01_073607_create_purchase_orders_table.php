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
            $table->unsignedBigInteger('supplier_id');
            $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('cascade');
            $table->date('order_date');
            $table->date('expected_delivery_date')->nullable();
            $table->string('status')->default('pending');
            $table->decimal('sub_total', 10, 2);
            $table->decimal('shipping_cost', 10, 2)->default(0.00);
            $table->decimal('tax_rate', 5, 2)->default(0.00);
            $table->decimal('tax_amount', 10, 2)->default(0.00);
            $table->decimal('grand_total', 10, 2);
            $table->string('payment_status')->default('unpaid');
            $table->unsignedBigInteger('payment_method_id')->nullable();
            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->nullOnDelete();
            $table->foreignId('created_by_id')->constrained('users');
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
