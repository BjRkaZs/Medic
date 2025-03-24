<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    public $timestamps = false;

    protected $table = 'appointment';
    
    protected $fillable = [
        'user_id',
        'name',
        'specialty',
        'description',
        'date'
    ];

    protected $casts = [
        'date' => 'datetime'
    ];
}
