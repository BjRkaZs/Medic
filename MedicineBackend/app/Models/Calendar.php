<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Calendar extends Model
{
    protected $table = 'calendar';

    protected $fillable = [
        'medicine_id',
        'name',
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
        'restock_reminder',
        'repeat'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'reminder_time1' => 'datetime',
        'reminder_time2' => 'datetime',
        'reminder_time3' => 'datetime',
        'reminder_time4' => 'datetime',
        'reminder_time5' => 'datetime',
        'restock_reminder' => 'date',
        'dosage' => 'double',
        'stock' => 'integer',
        'repeat' => 'integer'
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'name', 'name');
    }
}