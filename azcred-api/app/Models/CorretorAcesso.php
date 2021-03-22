<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class CorretorAcesso extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'acesso_corretor';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'banco'    => 'required',
        'usuario'       => 'required',
        'senha' => 'required',
    ];

    public static $messages = [
        'banco.required' => 'O banco deve ser preenchido.',
        'usuario.required' => 'O usuário deve ser preenchido.',
        'senha.required' => 'A senha deve ser preenchida.',
    ];
}
