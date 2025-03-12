<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Calendar extends Model
{
    protected $table = 'calendar';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'medicine_id',
        'description',
        'stock',
        'dosage',
        'start_date',
        'end_date',
        'reminder_time1',
        'reminder_time2',
        'reminder_time3',
        'reminder_time4',
        'reminder_time5',
        'restock',
        'restock_reminder',
        'repeat'
    ];

    protected $casts = [
        'start_date' => 'date:d-m-Y',
        'end_date' => 'date:d-m-Y',
        'reminder_time1' => 'datetime:H:i',
        'reminder_time2' => 'datetime:H:i',
        'reminder_time3' => 'datetime:H:i',
        'reminder_time4' => 'datetime:H:i',
        'reminder_time5' => 'datetime:H:i',
        'restock' => 'date:d-m-Y',
        'restock_reminder' => 'integer',
        'dosage' => 'double',
        'stock' => 'integer',
        'repeat' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }
}