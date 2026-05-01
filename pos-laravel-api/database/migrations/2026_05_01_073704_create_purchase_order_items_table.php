<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Purchase_Order_Items', function (Blueprint $table) {
            $table->id();

            // Foreign Keys
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');

            // Quantities & Prices
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_line_price', 10, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchaseOrderItems');
    }
};
