<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medicine;
use App\Http\Requests\MedicineModRequest;
use Illuminate\Support\Facades\Gate;

class ModMedController extends ResponseController
{
    public function addMedicine( MedicineModRequest $request ) {
        if (!Gate::any(['super', 'admin'])) {
            return $this->sendError( "Autentikációs hiba", "Nincs jogosultság", 401 );
        }
        $medicine = new Medicine;
        $medicine->name = $request["name"];
        $medicine->form = $request["form"];
        $medicine->substance = $request["substance"];

        $medicine->save();

        return $this->sendResponse( $medicine, "Sikeres hozzáadás" );
    }

    public function modifyMedicine( MedicineModRequest $request  ) {
        if (!Gate::any(['super', 'admin'])) {
            return $this->sendError( "Autentikációs hiba", "Nincs jogosultság", 401 );
        }
        $medicine = Medicine::find( $request["id"]);
        if( is_null( $medicine )) {
            $this->sendError( "Adathiba", [ "Nem található ilyen gyógyszer" ] );
        }
        $medicine->name = $request["name"];
        $medicine->form = $request["form"];
        $medicine->substance = $request["substance"];
        $medicine->update();

        return $this->sendResponse( $medicine, "Sikeres módosítás" );
    }

    public function deleteMedicine( Request $request ) {
        if (!Gate::any(['super', 'admin'])) {
            return $this->sendError( "Autentikációs hiba", "Nincs jogosultság", 401 );
        }
        $medicine = Medicine::find( $request["id"]);
        if( is_null( $medicine )) {
            $this->sendError( "Adathiba", [ "Nem található ilyen gyógyszer" ] );
        }
        $medicine->delete();

        return $this->sendResponse( $medicine, "Sikeres törlés" );
    }
}
