<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class MedReminderMail extends Mailable
{
    public function __construct(
        protected $medicineName,
        protected $dosage,
        protected $description,
        protected $reminderTime
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Medicine Reminder',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.medicine-reminder',
            with: [
                'medicineName' => $this->medicineName,
                'dosage' => $this->dosage,
                'description' => $this->description,
                'reminderTime' => $this->reminderTime
            ],
        );
    }
}