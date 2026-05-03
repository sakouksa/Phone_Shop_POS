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
        Schema::create('imei_trackings', function (Blueprint $table) {
            $table->id();

            // Foreign Key ភ្ជាប់ទៅកាន់ products
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('supplier_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('purchase_id')->nullable();
            $table->unsignedBigInteger('sale_id')->nullable();

            $table->string('imei_number')->unique();
            $table->decimal('cost_price', 10, 2)->default(0.00);
            $table->enum('status', ['available', 'sold', 'repair', 'trade_in'])->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imei_trackings');
    }
};
