<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convenio extends Model
{

    protected $table = 'convenio';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'nome'   => 'required|min:3|max:100|unique:convenio',
    ];

    public static $messages = [
        'nome.required' => 'O convênio deve ser preenchido.',
        'nome.unique' => 'Já existe um convênio com esse nome.',
        'nome.min' => 'O tamanho mínimo do convênio é :min caracteres.',
        'nome.max' => 'O tamanho máximo do convênio é :max caracteres.',
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }
}
