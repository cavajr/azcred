<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Acesso extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'acessos';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'banco' => 'required|min:3|max:200',
        'emprestimo' => 'required|min:3|max:200',
        'login' => 'required|min:3|max:50',
        'senha' => 'required|min:3|max:50',
        'link' => 'required|min:3|max:255',
    ];

    public static $messages = [
        'banco.required' => 'O banco deve ser preenchido.',
        'banco.min' => 'O tamanho mínimo do banco é :min caracteres.',
        'banco.max' => 'O tamanho máximo do banco é :max caracteres.',
        'emprestimo.required' => 'O emprestimo deve ser preenchido.',
        'emprestimo.min' => 'O tamanho mínimo do emprestimo é :min caracteres.',
        'emprestimo.max' => 'O tamanho máximo do emprestimo é :max caracteres.',
        'login.required' => 'O login deve ser preenchido.',
        'login.min' => 'O tamanho mínimo do login é :min caracteres.',
        'login.max' => 'O tamanho máximo do login é :max caracteres.',
        'senha.required' => 'A senha deve ser preenchida.',
        'senha.min' => 'O tamanho mínimo da senha é :min caracteres.',
        'senha.max' => 'O tamanho máximo da senha é :max caracteres.',
        'link.required' => 'O link deve ser preenchido.',
        'link.min' => 'O tamanho mínimo do link é :min caracteres.',
        'link.max' => 'O tamanho máximo do link é :max caracteres.',
    ];
}
