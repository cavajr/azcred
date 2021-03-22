<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Conta extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'conta';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'nome'   => 'required|min:3|max:25|unique:conta',
    ];

    public static $messages = [
        'nome.required' => 'A conta deve ser preenchida.',
        'nome.min' => 'O tamanho mínimo da conta é :min caracteres.',
        'nome.max' => 'O tamanho máximo da conta é :max caracteres.',
        'nome.unique' => 'Já existe uma conta com esse nome.',
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }
}
