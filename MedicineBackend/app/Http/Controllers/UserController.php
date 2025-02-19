<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserController extends ResponseController{
    public function register( RegisterRequest $request ) {
        $request->validated();

        $user = User::create([

            "name" => $request["name"],
            "email" => $request["email"],
            "password" => bcrypt( $request["password"]),
            "admin" => $request[ "admin" ]
        ]);

        return $this->sendResponse( $user->name, "Sikeres regisztráció");
    }

    public function login( LoginRequest $request ) {
        $request->validated();

        if( Auth::attempt([ "name" => $request["name"], "password" => $request["password"]])) {
            $actualTime = Carbon::now();
            $authUser = Auth::user();
            $bannedTime = ( new BanController )->getBannedTime( $authUser->name );
            ( new BanController )->reSetLoginCounter( $authUser->name );

            if( $bannedTime < $actualTime ) {
                ( new BanController )->resetBannedTime( $authUser->name );
                $token = $authUser->createToken( $authUser->name."Token" )->plainTextToken;
                $data["user"] = [ "user" => $authUser->name ];
                $data[ "time" ] = $bannedTime;
                $data["token"] = $token;

                return $this->sendResponse( $data, "Sikeres bejelentkezés");
            }else {
                return $this->sendError( "Autentikációs hiba", [ "Következő lehetőség: ", $bannedTime ], 401 );
            }
        }else {
            $loginCounter = ( new BanController )->getLoginCounter( $request[ "name" ]);
            if( $loginCounter < 3 ) {

                ( new BanController )->setLoginCounter( $request[ "name" ]);

            }else {

                ( new BanController )->setBannedTime( $request[ "name" ]);
            }
            $error = ( new BanController )->getBannedTime( $request[ "name" ]);
            $errorMessage = [ "time" => Carbon::now(), "hiba" => "Nem megfelelő felhasználónév vagy jelszó" ];
            return $this->sendError( $error, [$errorMessage], 401 );
        }
    }

    public function logout() {
        auth( "sanctum" )->user()->currentAccessToken()->delete();
        $name = auth( "sanctum" )->user()->name;

        return $this->sendResponse( $name, "Sikeres kijelentkezés");
    }



    public function getTokens() {
        $tokens = DB::table( "tokens" )->get();

        return $tokens;
    }
}
