<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trained_personnel', function (Blueprint $table) {
            // Drop old string columns
            $table->dropColumn(['specialization', 'status', 'barangay']);
            
            // Add foreign key columns
            $table->foreignId('specialization_id')->after('email')->nullable()->constrained('lookup_categories')->nullOnDelete();
            $table->foreignId('barangay_id')->after('specialization_id')->nullable()->constrained('barangays')->nullOnDelete();
            $table->foreignId('status_id')->after('barangay_id')->constrained('lookup_statuses')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('trained_personnel', function (Blueprint $table) {
            // Drop foreign key columns
            $table->dropForeign(['specialization_id']);
            $table->dropForeign(['barangay_id']);
            $table->dropForeign(['status_id']);
            $table->dropColumn(['specialization_id', 'barangay_id', 'status_id']);
            
            // Add back string columns
            $table->string('specialization', 100)->after('email');
            $table->string('barangay', 100)->after('specialization');
            $table->string('status', 100)->default('active')->after('barangay');
        });
    }
};
