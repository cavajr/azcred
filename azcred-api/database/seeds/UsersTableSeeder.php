<?php

use App\Permissao;
use App\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {      

        // Usuário Administrador
        $admin           = new User;
        $admin->name     = 'Administrador';
        $admin->email    = 'cavajr@bol.com.br';
        $admin->password = bcrypt('250709cavajr!');
        $admin->ativo    = true;
        $admin->admin    = true;
        $admin->save();
    
    }
}
