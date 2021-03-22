<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Comissao extends Model
{

    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'configuracao_comissao';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'perc_pago_inicio' => "required",
        'perc_pago_fim' => "required",
        'comissao' => "required"
    ];

    public static $messages = [
        "perc_pago_inicio.required" => "O percentual pago início é obrigatório.",
        "perc_pago_fim.required" => "O percentual pago fim é obrigatório.",
        "comissao.required" => "A comissão deve ser preenchida."
    ];
}
