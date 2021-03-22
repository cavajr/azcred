<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Banco extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'banco';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'nome'   => 'required|min:3|max:50|unique:banco',
    ];

    public static $messages = [
        'nome.required' => 'O banco deve ser preenchido.',
        'nome.unique' => 'Já existe um banco com esse nome.',
        'nome.min' => 'O tamanho mínimo do banco é :min caracteres.',
        'nome.max' => 'O tamanho máximo do banco é :max caracteres.',
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }
}
