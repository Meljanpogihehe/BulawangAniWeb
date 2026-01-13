<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app'); // This must point to resources/views/app.blade.php
})->where('any', '.*');