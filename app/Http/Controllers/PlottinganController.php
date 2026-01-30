<?php

namespace App\Http\Controllers;

use App\Models\Plottingan;
use App\Http\Requests\StorePlottinganRequest;
use App\Http\Requests\UpdatePlottinganRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlottinganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $plottingans = Plottingan::all();
        if (request()->wantsJson()) {
            return response()->json($plottingans);
        }
        return Inertia::render('welcome', ['plottingans' => $plottingans]);
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
            'user_id' => 'required|exists:users,id',
            'shift_id' => 'required|exists:shifts,id',
        ]);
        $plottingan = Plottingan::create($validated);

        if ($request->wantsJson()) {
            return response()->json($plottingan, 201);
        }
        return redirect()->back()->with('success', 'Plottingan created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Plottingan $plottingan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Plottingan $plottingan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plottingan $plottingan)
    {
        //
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'shift_id' => 'required|exists:shifts,id',
        ]);
        $plottingan->update($validated);

        if ($request->wantsJson()) {
            return response()->json($plottingan, 201);
        }
        return redirect()->back()->with('success', 'Plottingan created');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plottingan $plottingan)
    {
        //
        $plottingan->delete();
    }
}
