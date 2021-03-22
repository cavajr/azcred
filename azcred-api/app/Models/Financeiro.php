<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Financeiro extends Model
{

    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'financeiro';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'tipo'      => 'required',
        'data_mov'  => 'date|required',
        'nome'      => 'required|min:3|max:40',
        'descricao' => 'required',
        'valor'     => 'required'
    ];


    public static $messages = [
        'nome.required' => 'O nome deve ser preenchido.',
        'nome.min' => 'O tamanho mínimo do nome é :min caracteres.',
        'nome.max' => 'O tamanho máximo do nome é :max caracteres.',
        'descricao.required' => 'A descrição deve ser preenchida.',
        'valor.required' => 'O valor é obrigatório.',
        'data_mov.required' => 'A data deve ser preenchida.',
        'data_mov.date' => 'Data inválida.',
        'tipo.required' => 'O Tipo de lançamento deve ser preenchido.'
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }
}
