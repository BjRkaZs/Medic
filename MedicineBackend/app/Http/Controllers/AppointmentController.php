<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Http\Resources\Appointment as AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends ResponseController
{
    public function addAppointment(AppointmentRequest $request){
        $appointment = new Appointment();

        $appointment->user_id = auth("sanctum")->user()->id;
        $appointment->name = $request["name"];
        $appointment->specialty = $request["specialty"];
        $appointment->description = $request["description"];
        $appointment->date = $request["date"];

        $appointment->save();

        return $this->sendResponse( new AppointmentResource($appointment), "Sikeres hozzáadás" );
    }

    public function getAppointment(){
        $appointment = Appointment::where('user_id', auth("sanctum")->user()->id)->get();

        return $this->sendResponse(AppointmentResource::collection($appointment), "Sikeres lekérés");
    }

    public function editAppointment(AppointmentRequest $request, $id){
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return $this->sendError("Appointment entry not found", [], 404);
        }
        if ($appointment->user_id !== auth("sanctum")->user()->id) {
            return $this->sendError("Unauthorized", [], 403);
        }

        $appointment->name = $request["name"];
        $appointment->specialty = $request["specialty"];
        $appointment->description = $request["description"];
        $appointment->date = $request["date"];

        $appointment->save();

        return $this->sendResponse( new AppointmentResource($appointment), "Sikeres módosítás" );
    }

    public function deleteAppointment(Request $request){
        $id = $request["id"];
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return $this->sendError("Appointment entry not found", [], 404);
        }
        if ($appointment->user_id !== auth("sanctum")->user()->id) {
            return $this->sendError("Unauthorized", [], 403);
        }

        $appointment->delete();

        return $this->sendResponse( new AppointmentResource($appointment), "Sikeres törlés" );
    }
}
