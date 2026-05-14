<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            // Drop old string/enum columns
            $table->dropColumn(['category', 'type_of_emergency', 'condition']);
            
            // Add foreign key columns
            $table->foreignId('category_id')->after('name')->constrained('lookup_categories')->restrictOnDelete();
            $table->foreignId('emergency_type_id')->after('category_id')->nullable()->constrained('lookup_categories')->nullOnDelete();
            $table->foreignId('condition_id')->after('emergency_type_id')->nullable()->constrained('lookup_categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            // Drop foreign key columns
            $table->dropForeign(['category_id']);
            $table->dropForeign(['emergency_type_id']);
            $table->dropForeign(['condition_id']);
            $table->dropColumn(['category_id', 'emergency_type_id', 'condition_id']);
            
            // Add back string/enum columns
            $table->string('category', 100)->after('name');
            $table->string('type_of_emergency', 100)->default('Medical')->after('category');
            $table->enum('condition',['new','excellent','good','poor'])->default('new')->after('type_of_emergency');
        });
    }
};
