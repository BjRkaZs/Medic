<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;

class RestockReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        protected $medicineName,
        protected $stock,
        protected $dosage_unit,
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
                'stock_unit' => $this->dosage_unit,
                'restockDate' => $this->restockDate,
            ],
        );
    }
}