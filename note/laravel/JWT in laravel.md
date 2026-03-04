JWT Setup in Laravel

- JWT

- Install the tymon/jwt-auth package via Composer:
  - composer require tymon/jwt-auth

- Publish the package's configuration file:
  - php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
  - This will publish a config/jwt.php configuration file and create a JWT_SECRET key in your .env.

- Generate the JWT secret:
  - php artisan jwt:secret
  * This will generate a random key and set it in the .env file as JWT_SECRET.

- Set Up Authentication with JWT - Update the config/auth.php file to use jwt as the default guard for API authentication.
    'guards' => [
        'api' => [
            'driver' => 'jwt',
            'provider' => 'users',
        ],
    ],

* This tells Laravel to use JWT for authentication when the api guard is used.

- Update the User model
  use Tymon\JWTAuth\Contracts\JWTSubject;
  class User extends Authenticatable implements JWTSubject
  {
  use HasApiTokens;

        // Return the unique identifier for the user
        public function getJWTIdentifier()
        {
            return $this->getKey();
        }
        // Return an array of custom claims for the JWT
      public function getJWTCustomClaims()
      {
          return [];
      }

  }

- Create Auth Controller
  - php artisan make:controller AuthController

  namespace App\Http\Controllers;
  use Illuminate\Http\Request;
  use App\Models\User;
  use Illuminate\Support\Facades\Hash;
  use Tymon\JWTAuth\Facades\JWTAuth;
  use Tymon\JWTAuth\Exceptions\JWTException;

  class AuthController extends Controller
  {
        // Register a new user
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name, //body json client $request->name | $request->input('name')
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'user' => $user,
            'message' => 'ការចុះឈ្មោះអ្នកប្រើប្រាស់បានជោគជ័យ',
        ], 201);
    }
    // Login a user and return a JWT token
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Attempt to verify the credentials and create a token
        if (!$token = JWTAuth::attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'user' => JWTAuth::user(),
        ]);
    }
  }


use App\Http\Controllers\AuthController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');

// Protect Routes with JWT Authentication
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return response()->json($request->user());
});