<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Pagamento extends Model
{
    use LogsActivity;

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'pagamento';

    protected $guarded = ['id'];

    public $timestamps = false;

    public function contratos()
    {
        return $this->hasMany("App\Models\Producao", "corretor_id");
    }

    public function corretor() {
        return $this->belongsTo('App\Models\Corretor', 'corretor_id');
    }
}
