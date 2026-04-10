<?php

namespace Database\Seeders;

use App\Models\Puzzle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PuzzleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Flow:
     * 1. Northgard (first - no prerequisites)
     * 2. Euprus (requires Northgard)
     * 3. Xurith (requires Northgard)
     * 4. Thevia (last - requires Euprus AND Xurith)
     */
    public function run(): void
    {
        // Clear existing puzzles
        Puzzle::truncate();

        // Create Northgard first (no prerequisites)
        $northgard = Puzzle::create([
            'name' => 'Northgard',
            'clue' => 'Within the night sky',
            'answer' => '1234',
            'status' => false,
            'prerequisites' => null,
        ]);

        // Create Euprus (requires Northgard)
        $euprus = Puzzle::create([
            'name' => 'Euprus',
            'clue' => 'Shining its brilliance',
            'answer' => '1234',
            'status' => false,
            'prerequisites' => [$northgard->id],
        ]);

        // Create Xurith (requires Northgard)
        $xurith = Puzzle::create([
            'name' => 'Xurith',
            'clue' => 'Look underneath',
            'answer' => '1234',
            'status' => false,
            'prerequisites' => [$northgard->id],
        ]);

        // Create Thevia (requires Euprus AND Xurith)
        $thevia = Puzzle::create([
            'name' => 'Thevia',
            'clue' => 'The twilight star',
            'answer' => '1234',
            'status' => false,
            'prerequisites' => [$euprus->id, $xurith->id],
        ]);
    }
}
