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
            "admin" => 0,
        ]);

        return $this->sendResponse( $user->name, "Sikeres regisztráció");
    }

    public function login( LoginRequest $request ) {
        $request->validated();

        if( Auth::attempt([ "email" => $request["email"], "password" => $request["password"]])) {
            $actualTime = Carbon::now();
            $authUser = Auth::user();
            $bannedTime = ( new BanController )->getBannedTime( $authUser->email );
            ( new BanController )->reSetLoginCounter( $authUser->email );

            if( $bannedTime < $actualTime ) {
                ( new BanController )->resetBannedTime( $authUser->email );
                $token = $authUser->createToken( $authUser->email."Token" )->plainTextToken;
                $data= [
                    "user" => [
                        "name" => $authUser->name,
                        "email" => $authUser->email
                    ],
                    "token" => $token
                ];
                $data[ "time" ] = $bannedTime;
                $data["token"] = $token;

                return $this->sendResponse( $data, "Sikeres bejelentkezés");
            }else {
                return $this->sendError( "Autentikációs hiba", [ "Következő lehetőség: ", $bannedTime ], 401 );
            }
        }else {
            $loginCounter = ( new BanController )->getLoginCounter( $request[ "email" ]);
            if( $loginCounter < 3 ) {

                ( new BanController )->setLoginCounter( $request[ "email" ]);

            }else {

                ( new BanController )->setBannedTime( $request[ "email" ]);
            }
            $error = ( new BanController )->getBannedTime( $request[ "email" ]);
            $errorMessage = [ "time" => Carbon::now(), "hiba" => "Nem megfelelő e-mail vagy jelszó" ];
            return $this->sendError( $error, [$errorMessage], 401 );
        }
    }

    public function logout() {
        auth( "sanctum" )->user()->currentAccessToken()->delete();
        $name = auth( "sanctum" )->user()->email;

        return $this->sendResponse( $name, "Sikeres kijelentkezés");
    }



    public function getTokens() {
        $tokens = DB::table( "personal_access_tokens" )->get();

        return $tokens;
    }
}
