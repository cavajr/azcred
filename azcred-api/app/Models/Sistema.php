<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Sistema extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'sistema';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'nome'   => 'required|min:3|max:50|unique:sistema',
    ];

    public static $messages = [
        'nome.required' => 'O sistema deve ser preenchido.',
        'nome.unique' => 'Já existe um sistema com esse nome.',
        'nome.min' => 'O tamanho mínimo do sistema é :min caracteres.',
        'nome.max' => 'O tamanho máximo do sistema é :max caracteres.',
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }
}
