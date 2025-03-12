<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedController;
use App\Http\Controllers\ModMedController;
use App\Http\Controllers\CalendarController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware( "auth:sanctum" )->group( function(){
    Route::post( "/logout", [ UserController::class, "logout" ]);

    Route::get( "/getprofile", [ ProfileController::class, "getProfile" ]);
    Route::put( "/modifyprofile", [ ProfileController::class, "setProfile" ]);
    Route::delete("/deleteprofile", [ ProfileController::class, "deleteProfile" ]);

    Route::get( "/users", [ AuthController::class, "getUsers" ]);
    Route::put( "/admin", [ AuthController::class, "setAdmin" ]);
    Route::put( "/updateuser", [ AuthController::class, "updateUser" ]);

    Route::post( "/addmedicine", [ ModMedController::class, "addMedicine" ]);
    Route::put( "/modifymedicine", [ ModMedController::class, "modifyMedicine" ]);
    Route::delete( "/deletemedicine", [ ModMedController::class, "deleteMedicine" ]);
    Route::get( "/allmedicine", [ ModMedController::class, "getAllMedicine" ]);

    Route::post( "/calendar", [ CalendarController::class, "addCalendar" ]);
    Route::get( "/calendar", [ CalendarController::class, "getCalendar" ]);
});

Route::get( "/searchmedicine", [ MedController::class, "searchMedicine" ]);
Route::get( "/searchmedname", [ MedController::class, "searchMedicineName" ]);
Route::get( "/medforms", [ MedController::class, "getMedicineForms" ]);

Route::post( "/register", [ UserController::class, "register" ]);
Route::post( "/login", [ UserController::class, "login" ]);
Route::get( "/tokens", [ UserController::class, "getTokens" ]);

Route::post( "/sendpassreset", [ ProfileController::class, "passResetLink" ]);
Route::post('/passreset', [ProfileController::class, 'resetPassword']);
