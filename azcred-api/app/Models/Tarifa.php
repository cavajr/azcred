<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Tarifa extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'tarifa';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'nome'   => 'required|min:3|max:200|unique:tarifa',
    ];

    public static $messages = [
        'nome.required' => 'O nome deve ser preenchido.',
        'nome.unique' => 'Já existe uma tarifa com esse nome.',
        'nome.min' => 'O tamanho mínimo da tarifa é :min caracteres.',
        'nome.max' => 'O tamanho máximo da tarifa é :max caracteres.',
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }
}
