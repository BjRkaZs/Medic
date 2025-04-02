<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('check:medicine-reminder')->everyMinute();
        $schedule->command('check:restock-reminder')->dailyAt('13:00');
        $schedule->command('check:appointment-reminder')->hourly();
    }
}