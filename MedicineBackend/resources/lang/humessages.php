<?php

return [
    'validation' => [
        'medicine' => [
            'name' => [
                'required' => 'Gyógyszer nevének megadása kötelező',
                'max' => 'Túl hosszú gyógyszer név'
            ],
            'form' => [
                'required' => 'Forma megadása kötelező',
                'max' => 'Túl hosszú gyógyszer forma'
            ],
            'substance' => [
                'required' => 'Aktív hatóanyag megadása kötelező',
                'max' => 'Túl hosszú aktív hatóanyag'
            ]
        ],
        'auth' => [
            'email' => [
                'required' => 'E-mail cím megadása kötelező',
                'email' => 'Érvénytelen e-mail formátum',
                'exists' => 'Nem található felhasználó ezzel az e-mail címmel',
                'unique' => 'Ez az email cím már foglalt'
            ],
            'password' => [
                'required' => 'Jelszó megadása kötelező',
                'min' => 'A jelszó túl rövid (min. 8 karakter)',
                'regex' => 'A jelszónak tartalmaznia kell kisbetűt, nagybetűt és számot',
                'confirmed' => 'A jelszavak nem egyeznek'
            ],
            'name' => [
                'required' => 'Név megadása kötelező',
                'max' => 'Túl hosszú név'
            ]
        ],
        'calendar' => [
            'medicine_id' => [
                'required' => 'Gyógyszer kiválasztása kötelező',
                'exists' => 'A kiválasztott gyógyszer nem létezik'
            ],
            'description' => [
                'max' => 'Túl hosszú leírás'
            ],
            'stock' => [
                'required' => 'Készlet megadása kötelező',
                'numeric' => 'Készlet csak szám lehet'
            ],
            'dosage' => [
                'required' => 'Adag megadása kötelező',
                'numeric' => 'Adag csak szám lehet'
            ],
            'start_date' => [
                'required' => 'Kezdési dátum megadása kötelező',
                'date' => 'Érvénytelen kezdési dátum'
            ],
            'end_date' => [
                'required' => 'Befejezési dátum megadása kötelező',
                'date' => 'Érvénytelen befejezési dátum',
                'after' => 'Befejezési dátum nem lehet korábbi a kezdési dátumnál'
            ],
            'reminder_time1' => [
                'required' => 'Emlékeztető idő megadása kötelező',
                'date_format' => 'Érvénytelen emlékeztető idő formátum'
            ],
            'reminder_time2' => [
                'date_format' => 'Érvénytelen emlékeztető idő formátum'
            ],
            'reminder_time3' => [
                'date_format' => 'Érvénytelen emlékeztető idő formátum'
            ],
            'reminder_time4' => [
                'date_format' => 'Érvénytelen emlékeztető idő formátum'
            ],
            'reminder_time5' => [
                'date_format' => 'Érvénytelen emlékeztető idő formátum'
            ],
            'restock' => [
                'date' => 'Érvénytelen újra raktározási dátum'
            ],
            'restock_reminder' => [
                'numeric' => 'Újra raktározási emlékeztető csak szám lehet'
            ],
            'repeat' => [
                'integer' => 'Ismétlést kérem napokban adja meg'
            ]
        ]
    ],
    'errors' => [
        'auth' => 'Autentikációs hiba',
        'input' => 'Beviteli hiba',
        'data' => 'Adathiba'
    ]
];