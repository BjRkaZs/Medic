<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Medicine;
use App\Http\Requests\MedicineRequest;
use App\Http\Requests\MedicineModRequest;
use App\Http\Resources\Medicine as MedicineResource;

class MedController extends ResponseController{
    public function getMedicine() {

        $medicine = Medicine::with( "package", "type" )->get();

        return $this->sendResponse( MedicineResource::collection( $medicine ), "Sikeres olvasás");
    }

    public function getOneMedicine( Request $request ) {
        $medicine = Medicine::where( "medicine", $request["medicine"] )->first();
        if( !medicine ){
            return $this->sendError( "Adathiba", "Nincs ilyen Gyógyszer" );
        }

        return $this->sendResponse( new MedicineResource( $medicine ), "Sikeres olvasás");
    }

    public function getAmount( Request $request ) {

        $medicine = Medicine::where( "amount", $request["amount"] )->get();

        return $this->sendResponse( $medicine, "Rendelni kell.");
    }

    public function addMedicine( MedicineRequest $request ) {
        $medicine = new Medicine;
        $medicine->medicine = $request["medicine"];
        $medicine->amount = $request["amount"];
        $medicine->type_id = ( new TypeController )->getTypeId( $request[ "type" ]);
        $medicine->package_id = ( new PackageController )->getPackageId( $request[ "package" ]);

        $medicine->save();

        return $this->sendResponse( $medicine, "Sikeres felírás" );
    }

    public function modifyMedicine( MedicineModRequest $request  ) {

        $request->validated();
        $medicine = Medicine::find( $request[ "id" ]);

        if( is_null( $medicine )) {

            $this->sendError( "Adathiba", [ "Nincs ilyen ital" ] );

        }

        $medicine->medicine = $request[ "medicine" ];
        $medicine->amount = $request[ "amount" ];
        $medicine->type_id = ( new TypeController )->getTypeId( $request[ "type" ]);
        $medicine->package_id = ( new PackageController )->getPackageId( $request[ "package" ]);

        $medicine->update();

        return $this->sendResponse( $medicine, "Sikeres módosítás" );
    }

    public function destroy( Request $request ) {

        $medicine = Medicine::find( $request[ "id" ] );
        $medicine->delete();

        return $this->sendResponse( $medicine, "Sikeres törlés" );
    }
}
