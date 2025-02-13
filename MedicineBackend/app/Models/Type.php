<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Type extends Model
{
    public $timestamps = false;

    public function drink() {

        return $this->hasMany( Medicine::class );
    }
}
