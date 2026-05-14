<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            // Drop old string columns
            $table->dropColumn(['type', 'severity', 'status']);
            
            // Add foreign key columns
            $table->foreignId('type_id')->after('description')->nullable()->constrained('lookup_categories')->nullOnDelete();
            $table->foreignId('severity_id')->after('type_id')->nullable()->constrained('lookup_categories')->nullOnDelete();
            $table->foreignId('status_id')->after('severity_id')->constrained('lookup_statuses')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            // Drop foreign key columns
            $table->dropForeign(['type_id']);
            $table->dropForeign(['severity_id']);
            $table->dropForeign(['status_id']);
            $table->dropColumn(['type_id', 'severity_id', 'status_id']);
            
            // Add back string columns
            $table->string('type', 100)->nullable()->after('description');
            $table->string('severity', 100)->nullable()->after('type');
            $table->string('status', 100)->default('active')->after('severity');
        });
    }
};
