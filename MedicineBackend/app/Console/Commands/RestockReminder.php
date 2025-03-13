<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Calendar;
use App\Mail\RestockReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class RestockReminder extends Command
{
    protected $signature = 'check:restock-reminders';
    protected $description = 'Check and send restock reminder emails';

    public function handle()
    {
        $today = Carbon::today();
        
        $reminders = Calendar::with(['user', 'medicine'])
            ->whereNotNull('restock')
            ->whereNotNull('restock_reminder')
            ->get();

        foreach ($reminders as $reminder) {
            $restockDate = Carbon::parse($reminder->restock);
            $reminderDate = $restockDate->copy()->subDays($reminder->restock_reminder);
            
            if ($today->eq($reminderDate)) {
                Mail::to($reminder->user->email)->send(
                    new RestockReminderMail(
                        $reminder->medicine->name,
                        $reminder->stock,
                        $reminder->restock
                    )
                );
            }
        }
    }
}