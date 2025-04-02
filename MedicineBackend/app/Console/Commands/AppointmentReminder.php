<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Mail;
use App\Mail\AppointmentReminder as AppointmentReminderMail;

class AppointmentReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:appointment-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder emails for appointments 24 hours in advance';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $tomorrow = $now->copy()->addDay();
        
        $appointments = Appointment::with('user')
            ->whereDate('date', $tomorrow->format('Y-m-d'))
            ->whereTime('date', $now->format('H:i'))
            ->get();
    
        foreach ($appointments as $appointment) {
            $mail = new AppointmentReminderMail(
                specialty: $appointment->specialty ?? '',
                name: $appointment->name,
                date: Carbon::parse($appointment->date)->format('Y-m-d H:i'),
                description: $appointment->description
            );
            
            Mail::to($appointment->user->email)->queue($mail);
        }
    }
}
