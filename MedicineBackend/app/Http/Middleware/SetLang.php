<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLang
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('Accept-Language', 'hu');
        
        if (!in_array($locale, ['en', 'hu'])) {
            $locale = 'hu';
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
