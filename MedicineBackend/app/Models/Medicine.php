<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Medicine extends Model
{
    use HasFactory, Notifiable;

    public $timestamps = false;

    public function package() {

        return $this->belongsTo( Package::class );
    }

    public function type() {

        return $this->belongsTo( Type::class );
    }
}
