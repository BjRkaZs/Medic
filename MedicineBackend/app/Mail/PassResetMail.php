<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class PassResetMail extends Mailable
{
    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function build()
    {
        return $this->view('emails.password-reset')
                    ->subject('Jelszó visszaállítási kérelem');
    }
}