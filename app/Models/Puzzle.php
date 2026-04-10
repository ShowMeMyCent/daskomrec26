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
    ];

    protected $casts = [
        'status' => 'boolean',
        'prerequisites' => 'array',
    ];

    protected $attributes = [
        'status' => false,
        'prerequisites' => null,
    ];

    /**
     * Check if this puzzle can be unlocked based on prerequisites.
     * Returns true if all prerequisite puzzles are unlocked, false otherwise.
     */
    public function canUnlock(): bool
    {
        if (!$this->prerequisites || empty($this->prerequisites)) {
            return true;
        }

        $prerequisites = Puzzle::whereIn('id', $this->prerequisites)->get();
        
        foreach ($prerequisites as $prereq) {
            if (!$prereq->status) {
                return false;
            }
        }

        return true;
    }
}
