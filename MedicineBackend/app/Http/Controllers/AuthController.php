<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\ResponseController;
use Illuminate\Support\Facades\Gate;

class AuthController extends ResponseController{
    public function getUsers() {
        if ( !Gate::denies( "user" )) {
            return $this->sendError( "Autentikációs hiba", "Nincs jogosultság", 401 );
        }
        $users = User::all();

        return $this->sendResponse( $users, "Betöltve" );
    }

    public function setAdmin( Request $request ) {
        if ( !Gate::allows( "super" )) {
            return $this->sendError( "Autentikációs hiba", "Nincs jogosultság", 401 );
        }
        $user = User::find($request["id"]);
        if (!$user) {
            return $this->sendError("Adathiba", "Felhasználó nem található", 404);
        }
    
        $user->admin = $request["admin"];
        $user->update();

        return $this->sendResponse($user, "Admin jogosultság beállítva"); 
    }

    public function destroyUser() {
        
    }
}
