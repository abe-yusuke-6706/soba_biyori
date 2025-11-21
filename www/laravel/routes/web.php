<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CommentController;

Route::get('/home', function () {
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

// Route::get("/", function(){
//     return Inertia::render("Home");
// })->name("home");

Route::get('/', [PostController::class, 'index'])->name('post.index');

Route::middleware('auth')->group(function () {
    Route::get('/create', [PostController::class, 'create'])->name('post.create');
    Route::post('/store', [PostController::class, 'store'])->name('post.store');
    Route::get('/confirm', [PostController::class, 'confirm'])->name('post.confirm');
    Route::post('/confirm/complete', [PostController::class, 'complete'])->name('post.complete');
    Route::post('/show/{post}/like', [PostController::class, 'like'])
        ->name('post.like');
    Route::delete('/show/{post}/like', [PostController::class, 'unlike'])
        ->name('post.unlike');
});
Route::get('/show/{id}', [PostController::class, 'show'])->name('post.show');

Route::middleware('auth')->group(function () {
    Route::post('/show/{id}/comment', [CommentController::class, 'store'])
        ->name('comment.store');
});

require __DIR__ . '/auth.php';
