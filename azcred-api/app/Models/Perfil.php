<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Perfil extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'perfil';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'nome' => 'required|min:3|max:100|unique:perfil',
    ];

    public static $messages = [
        'nome.required' => 'O perfil deve ser preenchido.',
        'nome.unique' => 'Já existe um perfil com esse nome.',
        'nome.min' => 'O tamanho mínimo do perfil é :min caracteres.',
        'nome.max' => 'O tamanho máximo do perfil é :max caracteres.',
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }

    public function comissoes()
    {
        return $this->hasMany('App\Models\Comissao', 'perfil_id');
    }
}
