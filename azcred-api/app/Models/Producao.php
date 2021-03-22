<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Producao extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'tabela_producao';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $messages = [
        'corretor_id.required' => 'O corretor deve ser preenchido.',
        'fisicopendente.required' => 'O físico pendente deve ser preenchido.',
        'data_fisico.date' => 'A data do fisico é inválida.',
        'corretor_perc_comissao' => 'Percentual de comissão do corretor é obrigatório.',
    ];
}
