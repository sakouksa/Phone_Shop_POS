<?php

namespace App\Helpers;

use Illuminate\Support\Facades\File;

trait UploadHelper
{
    /**
     * @param $file
     * @param $path
     * @param $old_file
     * @return string|null
     */
    public function uploadImage($file, $path, $old_file = null)
    {
        if ($file) {
            // លុប file ចាស់បើមាន
            if ($old_file && File::exists(public_path('uploads/' . $path . '/' . $old_file))) {
                File::delete(public_path('uploads/' . $path . '/' . $old_file));
            }

            // កំណត់ឈ្មោះ file ថ្មី
            $filename = time() . '_' . $file->getClientOriginalName();

            // បង្កើត folder បើមិនទាន់មាន
            $upload_path = public_path('uploads/' . $path);
            if (!File::isDirectory($upload_path)) {
                File::makeDirectory($upload_path, 0777, true, true);
            }

            // ផ្លាស់ទី file
            $file->move($upload_path, $filename);

            return $filename;
        }

        return $old_file;
    }

    public function deleteImage($path, $filename)
    {
        if ($filename && File::exists(public_path('uploads/' . $path . '/' . $filename))) {
            File::delete(public_path('uploads/' . $path . '/' . $filename));
        }
    }
}