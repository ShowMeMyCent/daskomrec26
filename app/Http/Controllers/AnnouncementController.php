<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Http\Requests\StoreAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $announcements = Announcement::all();
        if (request()->wantsJson()) {
            return response()->json($announcements);
        }
        return Inertia::render('Announcements/Index', ['announcements' => $announcements]);
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
            'success_message' => 'required|string|max:255',
            'fail_message' => 'required|string|max:255',
            'stage_id' => 'required|exists:stages,id',
        ]);

        $announcement = Announcement::create($validated);
        if ($request->wantsJson()) {
            return response()->json($announcement, 201);
        }
        return redirect()->back()->with('success', 'Announcement created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Announcement $announcement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Announcement $announcement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Announcement $announcement)
    {
        //
        $validated = $request->validate([
            'success_message' => 'required|string|max:255',
            'fail_message' => 'required|string|max:255',
            'stage_id' => 'required|exists:stages,id',
        ]);

        $announcement->update($validated);
        if ($request->wantsJson()) {
            return response()->json($announcement, 201);
        }
        return redirect()->back()->with('success', 'Announcement created');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Announcement $announcement)
    {
        //
        $announcement->delete();
    }
}
