<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Alemar',
            'email' => 'alemarbalansag2@gmail.com',
            'username' => 'alemar',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'is_approved' => true,
        ]);
    }
}
