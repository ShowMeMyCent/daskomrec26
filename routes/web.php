<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('welcome');
});

Route::get('/login', function () {
    return inertia('User/login');
});
