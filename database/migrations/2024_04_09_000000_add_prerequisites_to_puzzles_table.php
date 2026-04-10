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
        Schema::table('puzzles', function (Blueprint $table) {
            // Store array of prerequisite puzzle IDs as JSON
            // Example: [1] means puzzle 1 must be unlocked first
            // Example: [1, 2] means puzzles 1 AND 2 must both be unlocked
            $table->json('prerequisites')->nullable()->default(null)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('puzzles', function (Blueprint $table) {
            $table->dropColumn('prerequisites');
        });
    }
};
