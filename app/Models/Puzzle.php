<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Puzzle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'clue',
        'answer',
        'status',
        'prerequisites',
        'prerequisites_mode',
    ];

    protected $casts = [
        'status' => 'boolean',
        'prerequisites' => 'array',
    ];

    protected $attributes = [
        'status' => false,
        'prerequisites' => null,
        'prerequisites_mode' => 'AND',
    ];

    /**
     * Check if this puzzle can be unlocked based on prerequisites.
     *
     * Mode 'AND' (default): ALL prerequisite puzzles must be unlocked.
     * Mode 'OR':            AT LEAST ONE prerequisite puzzle must be unlocked.
     */
    public function canUnlock(): bool
    {
        if (!$this->prerequisites || empty($this->prerequisites)) {
            return true;
        }

        $prerequisites = Puzzle::whereIn('id', $this->prerequisites)->get();
        $mode = strtoupper($this->prerequisites_mode ?? 'AND');

        if ($mode === 'OR') {
            // Unlock if at least one prerequisite is done
            foreach ($prerequisites as $prereq) {
                if ($prereq->status) {
                    return true;
                }
            }
            return false;
        }

        // Default: AND mode — all prerequisites must be unlocked
        foreach ($prerequisites as $prereq) {
            if (!$prereq->status) {
                return false;
            }
        }

        return true;
    }
}
