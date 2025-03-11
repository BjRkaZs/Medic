<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;

class BanController extends Controller{
    public function getLoginCounter( $email ) {
        $user = User::where( "email", $email )->first();
        if (!$user) {
            return 0; // Return 0 if user not found
        }
        $counter = $user->login_counter;

        return $counter;
    }

    public function resetLoginCounter( $email ) {
        $user = User::where( "email", $email )->first();
        if ($user) {
            $user->login_counter = 0;
            $user->update();
        }
    }

    public function setLoginCounter( $email ) {
        User::where( "email", $email )->increment( "login_counter" );
        
    }

    public function getBannedTime( $email ) {
         $user = User::where( "email", $email )->first();
         if (!$user) {
            return null;
        }
         $bannedTime = $user->banning_time;

         return $bannedTime;
    }

    public function setBannedTime( $email ) {
        $user = User::where( "email", $email )->first();
        if ($user) {
            $user->banning_time = Carbon::now()->addSeconds(60);
            $user->update();
        }
    }

    public function resetBannedTime( $email ) {
        $user = User::where( "email", $email )->first();
        if ($user) {
            $user->banning_time = null;
            $user->update();
        }
    }
}
