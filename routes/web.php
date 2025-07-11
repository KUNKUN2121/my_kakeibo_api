<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SbiTransactionsController;
use App\Http\Controllers\ViewController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/home', [ViewController::class, 'home'])->name('home');

// /home/* 以下のルーティング
Route::prefix('home')->group(function () {
    Route::get('/add', [ViewController::class, 'add'])->name('home');
    Route::get('/{id}/edit', [ViewController::class, 'home'])->name('home.edit');
    Route::get('/{id}/delete', [ViewController::class, 'home'])->name('home.delete');
    Route::get('/{id}', [ViewController::class, 'detail'])->name('home');
});

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
