<?php

namespace App\Http\Controllers;

use App\Models\Stage;
use App\Http\Requests\StoreStageRequest;
use App\Http\Requests\UpdateStageRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $stages = Stage::all();
        if (request()->wantsJson()) {
            return response()->json($stages);
        }
        return Inertia::render('Stages/Index', ['stages' => $stages]);
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
            'name' => 'required|string|max:255',
        ]);

        $stage = Stage::create($validated);

        if ($request->wantsJson()) {
            return response()->json($stage, 201);
        }

        return redirect()->back()->with('success', 'Item created');

    }


    /**
     * Display the specified resource.
     */
    public function show(Stage $stage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stage $stage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stage $stage)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $stage->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Stage updated successfully',
                'data' => $stage
            ], 200);
        }

        return redirect()->back()->with('success', 'Stage updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stage $stage)
    {
        //
        $stage->delete();
        if (request()->wantsJson()) {
            return response()->json(['message' => 'Stage deleted successfully'], 200);
        }
        return redirect()->back()->with('success', 'Stage deleted successfully');
    }
}
