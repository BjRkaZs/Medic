<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Medicine;
use App\Http\Requests\MedicineModRequest;
use App\Http\Resources\Medicine as MedicineResource;

class MedController extends ResponseController{
    // public function searchMedicine(Request $request) {
    //     $searchTerm = $request["name"];
    //     $medicine = Medicine::where('name', 'LIKE', $searchTerm . '%')->get();
        
    //     if ($medicine->isEmpty()) {
    //         return $this->sendError("Adathiba", "Nem található ilyen gyógyszer");
    //     }
        
    //     return $this->sendResponse(MedicineResource::collection($medicine), "Sikeres keresés");
    // }

    public function searchMedicineName(Request $request) {
        $searchTerm = $request["name"];
        
        $medicines = Medicine::where('name', 'LIKE', $searchTerm . '%')
            ->select('name')
            ->distinct()
            ->get();
        
        if ($medicines->isEmpty()) {
            return $this->sendError("Adathiba", "Nem található ilyen gyógyszer");
        }
        
        return $this->sendResponse($medicines, "Sikeres keresés");
    }
    
    public function getMedicineForms(Request $request) {
        $name = $request["name"];
        
        $forms = Medicine::where('name', $name)
            ->select('id', 'form')
            ->get();
        
        if ($forms->isEmpty()) {
            return $this->sendError("Adathiba", "Nem található ilyen kiszerelés");
        }
        
        return $this->sendResponse($forms, "Sikeres keresés");
    }
}
