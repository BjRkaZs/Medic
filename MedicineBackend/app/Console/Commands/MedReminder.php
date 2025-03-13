<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Calendar;
use App\Mail\MedReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class MedReminder extends Command
{
    protected $signature = 'check:medicine-reminder';
    protected $description = 'Check and send medicine reminder emails';

    public function handle()
    {
        $now = Carbon::now();
        $currentTime = $now->format('H:i');
        
        $reminders = Calendar::with(['user', 'medicine'])
            ->whereDate('start_date', '<=', $now)
            ->whereDate('end_date', '>=', $now)
            ->where(function($query) use ($currentTime) {
                $query->whereTime('reminder_time1', $currentTime)
                    ->orWhereTime('reminder_time2', $currentTime)
                    ->orWhereTime('reminder_time3', $currentTime)
                    ->orWhereTime('reminder_time4', $currentTime)
                    ->orWhereTime('reminder_time5', $currentTime);
            })
            ->get();

        foreach ($reminders as $reminder) {
            $startDate = Carbon::parse($reminder->start_date);
            $daysDiff = $now->diffInDays($startDate);
            
            if ($reminder->repeat && $daysDiff % $reminder->repeat !== 0) {
                continue;
            }

            $times = [
                $reminder->reminder_time1,
                $reminder->reminder_time2,
                $reminder->reminder_time3,
                $reminder->reminder_time4,
                $reminder->reminder_time5
            ];

            foreach ($times as $time) {
                if ($time && Carbon::parse($time)->format('H:i') === $currentTime) {
                    Mail::to($reminder->user->email)->send(
                        new MedReminderMail(
                            $reminder->medicine->name,
                            $reminder->dosage,
                            $reminder->description,
                            $time
                        )
                    );
                }
            }
        }
    }
}