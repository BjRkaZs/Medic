<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    
    protected $policies = [
        //
    ];
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('super', function (User $user) {
            return $user->admin === 2;  
        });

        Gate::define('admin', function (User $user) {
            return $user->admin === 1;  
        });

        Gate::define('user', function (User $user) {
            return $user->admin === 0; 
        });
    }
}
