<?php

namespace App\Http\Controllers;

use App\Models\Puzzle;
use App\Http\Requests\StorePuzzleRequest;
use App\Http\Requests\UpdatePuzzleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PuzzleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $puzzles = Puzzle::all();
        if (request()->wantsJson()) {
            return response()->json($puzzles);
        }
        return Inertia::render('welcome', ['puzzles' => $puzzles]);   
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string|max:255',
            'description' => 'nullable|string',
            'clue' => 'required|string',
            'status' => 'required|in:0,1',
        ]);

        $puzzle = Puzzle::create($validated);
        if ($request->wantsJson()) {
            return response()->json($puzzle, 201);
        }
        return redirect()->back()->with('success', 'Puzzle created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Puzzle $puzzle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Puzzle $puzzle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Puzzle $puzzle)
    {
        //
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string|max:255',
            'description' => 'nullable|string',
            'clue' => 'required|string',
            'status' => 'required|in:0,1',
        ]);

        $puzzle ->update($validated);
        
        if ($request->wantsJson()) {
            return response()->json($puzzle, 201);
        }
        return redirect()->back()->with('success', 'Puzzle created');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Puzzle $puzzle)
    {
        //
        $puzzle->delete();
    }
}
