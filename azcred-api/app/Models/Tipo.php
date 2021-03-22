<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Tipo extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'tipo';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'nome'   => 'required|min:3|max:50|unique:tipo',
    ];

    public static $messages = [
        'nome.required' => 'O tipo deve ser preenchido.',
        'nome.min' => 'O tamanho mínimo do tipo é :min caracteres.',
        'nome.max' => 'O tamanho máximo do tipo é :max caracteres.',
        'nome.unique' => 'Já existe um tipo com esse nome.',
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }

    public function sistemas()
    {
        return $this->hasMany('App\Models\TipoSistema', 'tipo_id');
    }
}
