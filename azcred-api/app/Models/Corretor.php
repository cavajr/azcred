<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Corretor extends Model
{
    use LogsActivity;

    protected static $ignoreChangedAttributes = ['telefone', 'obs'];

    protected static $logAttributes = ['*'];

    protected static $logOnlyDirty = true;

    protected static $submitEmptyLogs = false;

    protected $table = 'corretor';

    protected $guarded = ['id'];

    public $timestamps = false;

    public static $rules = [
        'nome' => 'required|min:3|max:100|unique:corretor',
        'perfil_id' => 'required',
        'pessoa' => 'required',
        'cpf' => 'required',
        'data_adm' => 'date',
    ];

    public static $messages = [
        'nome.required' => 'O nome deve ser preenchido.',
        'nome.min' => 'O tamanho mínimo do nome é :min caracteres.',
        'nome.max' => 'O tamanho máximo do nome é :max caracteres.',
        'nome.unique' => 'Já existe um corretor com esse nome cadastrado.',
        'pessoa.required' => 'O tipo de pessoa é obrigatório.',
        'perfil_id.required' => 'O perfil é obrigatório.',
        'cpf.required' => 'O CPF/CNPJ é obrigatório.',
        'data_adm.date' => 'A data de admissão é inválida.',
    ];

    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }

    public function setEnderecoAttribute($value)
    {
        $this->attributes['endereco'] = strtoupper($value);
    }

    public function setComplemAttribute($value)
    {
        $this->attributes['complem'] = strtoupper($value);
    }

    public function setBairroAttribute($value)
    {
        $this->attributes['bairro'] = strtoupper($value);
    }

    public function setCidadeAttribute($value)
    {
        $this->attributes['cidade'] = strtoupper($value);
    }

    public function setUfAttribute($value)
    {
        $this->attributes['uf'] = strtoupper($value);
    }

    public function acessos()
    {
        return $this->hasMany("App\Models\CorretorAcesso", "corretor_id");
    }

    public function contratos()
    {
        return $this->hasMany("App\Models\Producao", "corretor_id")->where('pago', '=', 'N')->whereNotNull('corretor_id');
    }
}
