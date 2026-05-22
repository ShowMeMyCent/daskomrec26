<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * prerequisites_mode controls how prerequisites are evaluated:
     *   'AND' (default) - ALL prerequisites must be unlocked (existing behavior)
     *   'OR'            - AT LEAST ONE prerequisite must be unlocked
     */
    public function up(): void
    {
        Schema::table('puzzles', function (Blueprint $table) {
            $table->string('prerequisites_mode', 3)
                ->default('AND')
                ->after('prerequisites')
                ->comment("'AND' = all prereqs required, 'OR' = any one prereq required");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('puzzles', function (Blueprint $table) {
            $table->dropColumn('prerequisites_mode');
        });
    }
};
