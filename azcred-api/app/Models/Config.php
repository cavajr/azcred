<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Config extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'configuracao';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'empresa' => "required",
        'cidade' => "required",
        'estado' => "required"
    ];

    public static $messages = [
        'empresa.required' => 'A empresa é obrigatória',
        'cidade.required' => 'A cidade é obrigatória',
        'estado.required' => 'O estado é obrigatório',
    ];
}
