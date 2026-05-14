<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('barangay_issuances', function (Blueprint $table) {
            // Drop the old string columns
            $table->dropColumn(['barangay_name', 'issued_by']);
            
            // Add foreign key columns
            $table->foreignId('barangay_id')->after('inventory_item_id')->constrained('barangays')->onDelete('cascade');
            $table->foreignId('user_id')->after('barangay_id')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('barangay_issuances', function (Blueprint $table) {
            // Drop the foreign key columns
            $table->dropForeign(['barangay_id']);
            $table->dropForeign(['user_id']);
            $table->dropColumn(['barangay_id', 'user_id']);
            
            // Add back the string columns
            $table->string('barangay_name', 100)->after('inventory_item_id');
            $table->string('issued_by', 100)->after('barangay_name');
        });
    }
};
