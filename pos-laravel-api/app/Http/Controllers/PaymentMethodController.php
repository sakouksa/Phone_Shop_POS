<?php
namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use App\Http\Requests\PaymentMethodRequest;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    // ទាញយកទិន្នន័យទាំងអស់
    public function index(Request $request)
    {
        $query = PaymentMethod::query();

        if ($request->filled('text_search')) {
            $query->where('name', 'LIKE', '%' . $request->text_search . '%');
        }

        $paymentMethods = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'list' => $paymentMethods,
        ]);
    }

    // បង្កើតទិន្នន័យថ្មី
    public function store(PaymentMethodRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('qr_code')) {
            $file = $request->file('qr_code');
            $filename = time() . '.' . $file->getClientOriginalExtension();

            // រក្សាទុកក្នុង public/uploads/qr_codes
            $file->move(public_path('uploads/qr_codes'), $filename);

            // បញ្ចូល Path ទៅក្នុង Database
            $data['qr_code'] = 'uploads/qr_codes/' . $filename;
        }

        $paymentMethod = PaymentMethod::create($data);

        return response()->json([
            'data'    => $paymentMethod,
            'message' => 'បង្កើតវិធីសាស្ត្រទូទាត់បានជោគជ័យ!',
        ], 201);
    }

    // បង្ហាញទិន្នន័យតាម ID
    public function show($id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (!$paymentMethod) {
            return response()->json(['message' => 'រកមិនឃើញវិធីសាស្ត្រទូទាត់នេះ'], 404);
        }

        return response()->json(['data' => $paymentMethod]);
    }

    // កែប្រែទិន្នន័យ
    public function update(PaymentMethodRequest $request, $id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (!$paymentMethod) {
            return response()->json(['message' => 'រកមិនឃើញវិធីសាស្ត្រទូទាត់នេះ'], 404);
        }

        $data = $request->validated();

        if ($request->hasFile('qr_code')) {
            // លុប file ចាស់ចេញ
            if ($paymentMethod->qr_code && file_exists(public_path($paymentMethod->qr_code))) {
                unlink(public_path($paymentMethod->qr_code));
            }

            $file = $request->file('qr_code');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/qr_codes'), $filename);
            $data['qr_code'] = 'uploads/qr_codes/' . $filename;
        }

        $paymentMethod->update($data);

        return response()->json([
            'data'    => $paymentMethod,
            'message' => 'កែប្រែវិធីសាស្ត្រទូទាត់បានជោគជ័យ!',
        ]);
    }

    // លុបទិន្នន័យ
    public function destroy($id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (!$paymentMethod) {
            return response()->json(['message' => 'រកមិនឃើញវិធីសាស្ត្រទូទាត់នេះ'], 404);
        }

        // លុប file រូបភាពចេញពី Server
        if ($paymentMethod->qr_code && file_exists(public_path($paymentMethod->qr_code))) {
            unlink(public_path($paymentMethod->qr_code));
        }

        $paymentMethod->delete();

        return response()->json([
            'success' => true,
            'message' => 'លុបវិធីសាស្ត្រទូទាត់បានជោគជ័យ!',
        ]);
    }
}
