<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class TipoSistema extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'tipo_sistema';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'tipo_id'    => 'required',
        'sistema_id' => 'required'
    ];

    public static $messages = [
        'tipo_id.required' => 'O Tipo de contrato deve ser preenchido.',
        'sistema_id.required' => 'O sistema deve ser preenchido.',
    ];

    public function tipo_id()
    {
        return $this->belongsTo('App\Models\Tipo', 'tipo_id');
    }

    public function sistema_id()
    {
        return $this->belongsTo('App\Models\Sistema', 'sistema_id');
    }
}
