<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role; // កុំភ្លេច Import Role Model
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $adminRole = Role::updateOrCreate(
            ['role_name' => 'Admin'],
            ['permissions' => ['all_access', 'manage_users', 'view_reports']]
        );

        $cashierRole = Role::updateOrCreate(
            ['role_name' => 'Cashier'],
            ['permissions' => ['make_sales', 'view_products']]
        );

        // ២. បង្កើត User Admin គំរូ
        User::create([
            'role_id'   => $adminRole->id, // ភ្ជាប់ទៅ Admin Role
            'full_name' => 'CivilAI Admin',
            'username'  => 'admin',
            'email'     => 'admin@civilai.com',
            'password'  => Hash::make('password123'), // លេខសម្ងាត់សម្រាប់តេស្ត
            'phone'     => '012345678',
            'status'    => 'active',
            'image'     => 'default_user.png',
        ]);

        // ៣. បង្កើត User បុគ្គលិកលក់ (Cashier) គំរូ
        User::create([
            'role_id'   => $cashierRole->id, // ភ្ជាប់ទៅ Cashier Role
            'full_name' => 'General Cashier',
            'username'  => 'cashier01',
            'email'     => 'cashier@civilai.com',
            'password'  => Hash::make('password123'),
            'phone'     => '098765432',
            'status'    => 'active',
            'image'     => 'default_user.png',
        ]);

    }
}