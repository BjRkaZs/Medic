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
        $user = User::find( $request[ "id" ]);
        $user->admin = 1;

        $user->update();
    }

    public function updateUser( Request $request ) {
        if( !Gate::denies( "user" )) {
            return $this->sendError( "Autentikációs hiba", "Nincs jogosultság", 401 );
        }

        $user = User::find( $request[ "id" ]);
        $user->name = $request[ "name" ];
        $user->email = $request[ "email" ];
        $user->update();

        return $this->sendResponse( $user, "Felhasználó frissítve" );
    }

    public function destroyUser() {
        
    }
}
