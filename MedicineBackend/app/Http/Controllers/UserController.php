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

    public function login(LoginRequest $request) {
        $request->validated();
        $user = User::where('email', $request['email'])->first();

        if ($user && $user->banned) {
            return $this->sendError("Autentikációs hiba", "Ez a fiók ki lett tiltva", 401);
        }
    
        $actualTime = Carbon::now();
        $banController = new BanController();
        $bannedTime = $banController->getBannedTime($request['email']);
        
        if ($bannedTime && $bannedTime > $actualTime) {
            $timeLeft = $actualTime->diffInSeconds($bannedTime);
            return $this->sendError("Autentikációs hiba", 
                "Túl sok sikertelen próbálkozás. Várjon még {$timeLeft} másodpercet.", 401);
        }
    
        if (Auth::attempt(["email" => $request["email"], "password" => $request["password"]])) {
            $authUser = Auth::user();
            $banController->resetLoginCounter($authUser->email);
            $banController->resetBannedTime($authUser->email);
            
            $token = $authUser->createToken($authUser->email."Token")->plainTextToken;
            $data = [
                "user" => [
                    "name" => $authUser->name,
                    "email" => $authUser->email,
                    "admin" => $authUser->admin
                ],
                "token" => $token
            ];
            return $this->sendResponse($data, "Sikeres bejelentkezés");
        } else {
            $loginCounter = $banController->getLoginCounter($request["email"]);
            $banController->setLoginCounter($request["email"]);
            
            if ($loginCounter >= 2) {
                $banController->setBannedTime($request["email"]);
                return $this->sendError("Autentikációs hiba", 
                    "Túl sok sikertelen próbálkozás. Várjon 60 másodpercet.", 401);
            }
    
            return $this->sendError("Autentikációs hiba", 
                "Nem megfelelő e-mail vagy jelszó (" . (3 - $loginCounter - 1) . " próbálkozás maradt)", 401);
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
