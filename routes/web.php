<?php

use App\Http\Controllers\ShiftController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::resource('user', UserController::class);
Route::resource('stage', StageController::class);
Route::resource('shift', ShiftController::class);


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
Route::get('/', function () {
    return inertia('welcome');
});

Route::get('/login', function () {
    return inertia('User/login');
});

Route::get('/user/', function () {
    return inertia('User/home');
});

Route::get('/user/home', function () {
    return inertia('User/home');
});

Route::get('/user/profile', function () {
    return inertia('User/profile');
});

Route::get('/user/password', function () {
    return inertia('User/password');
});

Route::get('/user/assistants', function () {
    return inertia('User/assistants');
});

Route::get('/user/oaline', function () {
    return inertia('User/oaline');
});

Route::get('/user/shift', function () {
    return inertia('User/shift');
});

Route::get('/user/announcement', function () {
    return inertia('User/announcement');
});

Route::get('/user/cores', function () {
    return inertia('User/cores');
});

Route::get('/admin/login', function () {
    return inertia('Admin/login');
});

Route::get('/admin/home', function () {
    return inertia('Admin/home');
});

Route::get('/admin/shift', function () {
    return inertia('Admin/shift');
});

Route::get('/admin/password', function () {
    return inertia('Admin/password');
});

Route::get('/admin/caas', function () {
    return inertia('Admin/caas');
});
