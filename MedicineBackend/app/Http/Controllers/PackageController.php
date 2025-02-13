<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Package;
use App\Http\Requests\PackageRequest;
use App\Http\Controllers\ResponseController;
use App\Http\Resources\Package as PackageResource;

class PackageController extends ResponseController {

    public function getPackages() {

        $packages = Package::all();

        return $this->sendResponse( PackageResource::collection( $packages ), "Kiszerelések betöltve");
    }

    public function getPackage( Request  $request ) {

        $package = Package::where( "package", $request[ "package" ] )->first();

        if( is_null( $package )) {

            return $this->sendError( "Adathiba", [ "Nincs ilyen kiszerelés" ] );

        }

        return $this->sendResponse( $package, "Kiszerelés betöltve" );
    }

    public function newPackage( PackageRequest $request ) {

        $request->validated();

        $package = new Package();
        $package->package = $request[ "package" ];

        $package->save();

        return $this->sendResponse( new PackageResource( $package ), "Kiszerelés kiírva");
    }

    public function modifyPackage( PackageRequest $request  ) {

        $request->validated();

        $package = Package::find( $request[ "id" ] );
        if( is_null( $package )) {

            $this->sendError( "Adathiba", [ "Nincs ilyen ital" ] );

        }

        $package->package = $request[ "package" ];
        $package->update();

        return $this->sendResponse( new PackageResource( $package ), "Kiszerelés módosítva");
    }

    public function destroyPackage( Request $request ) {

        $package = Package::find( $request[ "id" ]);

        if( is_null( $package )) {

            return $this->sendError( "Adathiba", [ "Kiszerelés nem létezik" ], 405 );

        }

        $package->delete();

        return $this->sendResponse( new PackageResource( $package ), "Kiszerelés törölve" );
    }

    public function getPackageId( $packageName ) {

        $package = Package::where( "package", $packageName )->first();

        $id = $package->id;

        return $id;
    }
}
