<?php

namespace App\Http\Controllers;

use App\Http\Requests\CalendarRequest;
use App\Models\Calendar;
use Illuminate\Http\Request;
use App\Http\Resources\Calendar as CalendarResource;

class CalendarController extends ResponseController
{
    public function addCalendar( CalendarRequest $request ) {
        $calendar = new Calendar;

        $calendar->user_id = auth("sanctum")->user()->id;
        $calendar->medicine_id = $request["medicine_id"];
        $calendar->description = $request["description"];
        $calendar->stock = $request["stock"];
        $calendar->dosage = $request["dosage"];
        $calendar->start_date = $request["start_date"];
        $calendar->end_date = $request["end_date"];
        $calendar->reminder_time1 = $request["reminder_time1"];
        $calendar->reminder_time2 = $request["reminder_time2"];
        $calendar->reminder_time3 = $request["reminder_time3"];
        $calendar->reminder_time4 = $request["reminder_time4"];
        $calendar->reminder_time5 = $request["reminder_time5"];
        $calendar->restock_reminder = $request["restock_reminder"];
        $calendar->repeat = $request["repeat"];

        $calendar->save();
        $calendar->load('medicine');

        return $this->sendResponse( new CalendarResource($calendar), "Sikeres hozzáadás" );
    }
}
