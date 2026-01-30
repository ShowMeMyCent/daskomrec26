<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Http\Requests\StoreShiftRequest;
use App\Http\Requests\UpdateShiftRequest;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $shifts = Shift::orderBy('date', 'asc')->orderBy('shift_no', 'asc')->paginate(5);
        if (request()->wantsJson()) {
            return response()->json($shifts);
        }
        return inertia('welcome', ['shifts' => $shifts]);
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
            'date' => 'required|date',
            'shift_no' => 'required|integer',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i',
            'kuota' => 'required|integer',
        ]);

        $shift = Shift::create($validated);

        if ($request->wantsJson()) {
            return response()->json($shift, 201);
        }
        return redirect()->back()->with('success', 'Shift created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Shift $shift)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shift $shift)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Shift $shift)
    {
        //
        $validated = $request->validate([
            'date' => 'required|date',
            'shift_no' => 'required|integer',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i',
            'kuota' => 'required|integer',
        ]);

        $shift->update($validated);

        if ($request->wantsJson()) {
            return response()->json($shift, 201);
        }
        return redirect()->back()->with('success', 'Shift created');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shift $shift)
    {
        //
        $shift->delete();
    }
}
