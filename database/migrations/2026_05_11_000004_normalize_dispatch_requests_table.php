<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dispatch_requests', function (Blueprint $table) {
            // Drop old string columns
            $table->dropColumn(['requester_name', 'category', 'status']);
            
            // Add foreign key columns
            $table->foreignId('user_id')->after('id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('category_id')->after('date_time')->nullable()->constrained('lookup_categories')->nullOnDelete();
            $table->foreignId('status_id')->after('items')->constrained('lookup_statuses')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('dispatch_requests', function (Blueprint $table) {
            // Drop foreign key columns
            $table->dropForeign(['user_id']);
            $table->dropForeign(['category_id']);
            $table->dropForeign(['status_id']);
            $table->dropColumn(['user_id', 'category_id', 'status_id']);
            
            // Add back string columns
            $table->string('requester_name', 100)->after('id');
            $table->string('category', 100)->nullable()->after('date_time');
            $table->string('status', 100)->default('pending')->after('items');
        });
    }
};
