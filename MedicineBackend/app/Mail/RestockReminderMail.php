<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class RestockReminderMail extends Mailable
{
    public function __construct(
        protected $medicineName,
        protected $stock,
        protected $restockDate
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Medicine Restock Reminder',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.restock-reminder',
            with: [
                'medicineName' => $this->medicineName,
                'stock' => $this->stock,
                'restockDate' => $this->restockDate,
            ],
        );
    }
}