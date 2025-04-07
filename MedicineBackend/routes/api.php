<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedController;
use App\Http\Controllers\ModMedController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\AppointmentController;

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
    Route::put( "/banuser", [ AuthController::class, "banUser" ]);
    Route::put( "/unbanuser", [ AuthController::class, "unbanUser" ]);

    Route::post( "/addmedicine", [ ModMedController::class, "addMedicine" ]);
    Route::get( "/allmedicine", [ ModMedController::class, "getAllMedicine" ]);
    Route::put( "/modifymedicine", [ ModMedController::class, "modifyMedicine" ]);
    Route::delete( "/deletemedicine", [ ModMedController::class, "deleteMedicine" ]);

    Route::get('/searchusermeds', [MedController::class, 'searchUserMedicines']);

    Route::post( "/calendar", [ CalendarController::class, "addCalendar" ]);
    Route::get( "/calendar", [ CalendarController::class, "getCalendar" ]);
    Route::put('/editcalendar/{id}', [ CalendarController::class, 'editCalendar']);
    Route::delete('/deletecalendar/{id}', [ CalendarController::class, 'deleteCalendar']);

    Route::post('/addappointment', [ AppointmentController::class, 'addAppointment']);
    Route::get('/getappointment', [ AppointmentController::class, 'getAppointment']);
    Route::put('/editappointment/{id}', [ AppointmentController::class, 'editAppointment']);
    Route::delete('/deleteappointment/{id}', [ AppointmentController::class, 'deleteAppointment']);
});

Route::get( "/searchmedname", [ MedController::class, "searchMedicine" ]);
Route::get( "/medforms", [ MedController::class, "getMedicineForms" ]);

Route::post( "/register", [ UserController::class, "register" ]);
Route::post( "/login", [ UserController::class, "login" ]);
Route::get( "/tokens", [ UserController::class, "getTokens" ]);

Route::post( "/sendpassreset", [ ProfileController::class, "passResetLink" ]);
Route::post('/passreset', [ProfileController::class, 'resetPassword']);
