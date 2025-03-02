<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedController;
use App\Http\Controllers\ModMedController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware( "auth:sanctum" )->group( function(){
    Route::post( "/logout", [ UserController::class, "logout" ]);

    Route::get( "/getprofile", [ ProfileController::class, "getProfile" ]);
    Route::put( "/modifyprofile", [ ProfileController::class, "setProfile" ]);
    Route::put( "/modifypassword", [ ProfileController::class, "setPassword" ]);
    Route::delete("/deleteprofile", [ ProfileController::class, "deleteProfile" ]);

    Route::get( "/users", [ AuthController::class, "getUsers" ]);
    Route::put( "/admin", [ AuthController::class, "setAdmin" ]);
    Route::put( "/updateuser", [ AuthController::class, "updateUser" ]);

    Route::post( "/addmedicine", [ ModMedController::class, "addMedicine" ]);
    Route::put( "/modifymedicine", [ ModMedController::class, "modifyMedicine" ]);
    Route::delete( "/deletemedicine", [ ModMedController::class, "deleteMedicine" ]);
    Route::get( "/allmedicine", [ ModMedController::class, "getAllMedicine" ]);
});

Route::get( "/searchmedicine", [ MedController::class, "searchMedicine" ]);

Route::post( "/register", [ UserController::class, "register" ]);
Route::post( "/login", [ UserController::class, "login" ]);
Route::get( "/tokens", [ UserController::class, "getTokens" ]);

