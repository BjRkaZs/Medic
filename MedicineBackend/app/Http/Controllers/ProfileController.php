<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\PassResetRequest;
use App\Mail\PassResetMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\ResponseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ProfileController extends ResponseController{
    public function getProfile() {
        $user = auth( "sanctum" )->user();
        $data = [
            "name" => $user->name,
            "email" => $user->email,
        ];

        return $this->sendResponse( $data, "Felhasználó profil");
    }

    public function setProfile( Request $request ) {
        $user = auth( "sanctum" )->user();
        $user->name = $request[ "name" ];
        $user->email = $request[ "email" ];
        $user->update();

        return $this->sendResponse( $user, "Profil módosítva");
    }

    public function passResetLink(PassResetRequest $request){
        $token = Str::random(64);
        
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $token,
                'created_at' => now()
            ]
        );

        Mail::to($request->email)->send(new PassResetMail($token, $request->email));

        return $this->sendResponse([], 'Jelszó visszaállítási link elküldve.');
    }

    public function resetPassword(Request $request){
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed'
        ]);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$resetRecord) {
            return $this->sendError('Érvénytelen vagy lejárt token', [], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = bcrypt($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return $this->sendResponse([], 'Jelszó sikeresen megváltoztatva');
    }

    public function deleteProfile() {
        $user = auth( "sanctum" )->user();
        $user->tokens()->delete();
        $user->delete();

        return $this->sendResponse( $user, "Profil törölve");
    }
}
