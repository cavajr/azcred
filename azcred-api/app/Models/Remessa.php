<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remessa extends Model {

    protected $table = 'remessa';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'corretor_id' => 'required',
        'status_id' => 'required',
    ];

    public static $messages = [
        'corretor_id.required' => 'O corretor deve ser preenchido.',
        'status_id.required' => 'O status deve ser preenchido.',
    ];

    public function itens() {
        return $this->hasMany('App\Models\RemessaItem', 'remessa_id');
    }

}
