<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Activitylog\Traits\LogsActivity;

class User extends Authenticatable
{
    use Notifiable, LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $fillable = [
        'name', 'email', 'password', 'ativo', 'acesso_externo', 'corretor_id',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public $timestamps = false;

    public static $messages = [
        'name.required' => 'O usuário deve ser preenchido.',
        'name.max' => 'O tamanho máximo do nome é :max caracteres.',
        'email.required' => 'O email deve ser preenchido.',
        'email.min' => 'O tamanho mínimo do email é :min caracteres.',
        'email.max' => 'O tamanho máximo do email é :max caracteres.',
        'email.email' => 'E-mail inválido'
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['name'] = strtoupper($value);
    }

    public function eAdmin()
    {
        return (bool) $this->existePapel('ADMINISTRADORES');
    }

    public function papeis()
    {
        return $this->belongsToMany(Papel::class);
    }

    public function adicionaPapel($papel)
    {
        if (is_string($papel)) {
            $papel = Papel::where('nome', '=', $papel)->firstOrFail();
        }

        if ($this->existePapel($papel)) {
            return;
        }

        return $this->papeis()->attach($papel);
    }

    public function existePapel($papel)
    {
        if (is_string($papel)) {
            $papel = Papel::where('nome', '=', $papel)->firstOrFail();
        }

        return (bool) $this->papeis()->find($papel->id);
    }

    public function hasPermission(Permissao $permission)
    {
        return $this->hasAnyRoles($permission->papeis);
    }

    public function hasAnyRoles($roles)
    {
        if (is_array($roles) || is_object($roles)) {
            return $roles->intersect($this->papeis)->count();
        }
        return $this->papeis->contains('nome', $roles);
    }

    public function removePapel($papel)
    {
        if (is_string($papel)) {
            $papel = Papel::where('nome', '=', $papel)->firstOrFail();
        }

        return $this->papeis()->detach($papel);
    }

    public function temUmPapelDestes($papeis)
    {
        $userPapeis = $this->papeis;
        return $papeis->intersect($userPapeis)->count();
    }

    public function minhasPermissoes()
    {
        $permissoes = [];

        foreach ($this->papeis as $role) {
            $permissions = $role->permissoes;
            foreach ($permissions as $permission) {
                array_push($permissoes, $permission->nome);
            }
        }

        $result = array_unique($permissoes);
        return $result;
    }

    public function contratos()
    {
        return $this->hasMany('App\Models\Contrato', 'digitador_id');
    }
}
