<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resource_dispatches', function (Blueprint $table) {
            // Drop old string column
            $table->dropColumn('status');
            
            // Add foreign key column
            $table->foreignId('status_id')->after('quantity_dispatched')->constrained('lookup_statuses')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('resource_dispatches', function (Blueprint $table) {
            // Drop foreign key column
            $table->dropForeign(['status_id']);
            $table->dropColumn('status_id');
            
            // Add back string column
            $table->string('status', 100)->default('dispatched')->after('quantity_dispatched');
        });
    }
};
