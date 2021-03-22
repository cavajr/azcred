<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\User;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth as JWTAuth;

class AuthController extends Controller
{
    private $jwtAuth;

    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$credentials['email'] || !$credentials['password']) {
            return response()->json('Usuário ou senha não informada', 400);
        }

        $user = DB::table('users')->where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json("Usuário sem acesso !", 422);
        }

        if ($user->ativo === 0) {
            return response()->json("Usuário bloqueado !", 422);
        }

        if (!$token = $this->jwtAuth->attempt($credentials)) {
            return response()->json('Usuário ou senha inválidos', 422);
        }

        $user = Auth::user();
        $user->name = $this->nomeSobrenome($user->name);

        $roles = $user->papeis->pluck('nome');
        $permissions = $user->minhasPermissoes();

        $token = $this->jwtAuth->fromUser($user, ['user' => $user->makeHidden('papeis'), 'roles' => $roles, 'permissions' => $permissions]);
        return response()->json(['token' => $token, 'imagem' => $user->arquivo]);
    }

    public function refresh(Request $request)
    {

        $oldToken = $request->query('token');

        $tokenParts = explode(".", $oldToken);
        $tokenHeader = base64_decode($tokenParts[0]);
        $tokenPayload = base64_decode($tokenParts[1]);
        $jwtPayload = json_decode($tokenPayload);

        $user = $jwtPayload->user;

        $user = User::where('id', $user->id)->first();
        $user->name = $this->nomeSobrenome($user->name);

        $roles = $user->papeis->pluck('nome');
        $permissions = $user->minhasPermissoes();

        $token = $this->jwtAuth->fromUser($user, ['user' => $user->makeHidden('papeis'), 'roles' => $roles, 'permissions' => $permissions]);
        return response()->json(['token' => $token, 'imagem' => $user->arquivo]);
    }

    public function logout()
    {
        $token = $this->jwtAuth->getToken();
        $this->jwtAuth->invalidate($token);
        return response()->json(['logout']);
    }

    private function nomeSobrenome($value)
    {
        $partes = explode(' ', $value);
        $primeiroNome = array_shift($partes);

        $ultimoNome = array_pop($partes);

        return rtrim($primeiroNome . ' ' . $ultimoNome);
    }
}
