<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{

    protected $table = 'status';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'nome'   => 'required|min:3|max:20|unique:status',
    ];

    public static $messages = [
        'nome.required' => 'O nome deve ser preenchida.',
        'nome.min' => 'O tamanho mínimo do status é :min caracteres.',
        'nome.max' => 'O tamanho máximo do status é :max caracteres.',
        'nome.unique' => 'Já existe um status com esse nome.',
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }
}
