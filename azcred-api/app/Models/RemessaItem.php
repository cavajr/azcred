<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RemessaItem extends Model {  
    
    protected $table = 'remessa_item';
    
    protected $guarded = ['id'];
    
    public $timestamps = false;
    
    public static $rules = [
        'remessa_id'    => 'required',
        'contrato_id'   => 'required',        
    ];                        
    
    public static $messages = [
        'remessa_id.required' => 'A remesssa deve ser preenchida.',
        'contrato_id.required' => 'O contrato deve ser preenchido.',
    ];    
    
    public function contrato() {
        return $this->belongsTo('App\Models\Contrato', 'contrato_id');
    }

}
