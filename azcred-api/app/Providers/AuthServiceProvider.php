<?php

namespace App\Providers;

use App\Permissao;
use App\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{

    protected $policies = [
        //'App\Model' => 'App\Policies\ModelPolicy',
    ];

    public function boot()
    {
        $this->registerPolicies();

        $permissions = Permissao::with('papeis')->get();

        foreach ($permissions as $permission) {
            \Gate::define($permission->nome, function (User $user) use ($permission) {
                return $user->hasPermission($permission);
            });
        }

        \Gate::before(function (User $user, $ability) {
            if ($user->eAdmin()) {
                return true;
            }
        });
    }
}
