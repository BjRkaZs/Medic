<?php

return [
    'validation' => [
        'medicine' => [
            'name' => [
                'required' => 'Medicine name is required',
                'max' => 'Medicine name is too long'
            ],
            'form' => [
                'required' => 'Form is required',
                'max' => 'Form name is too long'
            ],
            'substance' => [
                'required' => 'Active substance is required',
                'max' => 'Active substance is too long'
            ]
        ],
        'auth' => [
            'email' => [
                'required' => 'Email is required',
                'email' => 'Invalid email format',
                'exists' => 'No user found with this email',
                'unique' => 'Email already exists'
            ],
            'password' => [
                'required' => 'Password is required',
                'min' => 'Password must be at least 8 characters',
                'regex' => 'Password must contain lowercase, uppercase and numbers',
                'confirmed' => 'Passwords do not match'
            ],
            'name' => [
                'required' => 'Name is required',
                'max' => 'Name is too long'
            ]
        ],
        'calendar' => [
            'medicine_id' => [
                'required' => 'Medicine must be selected',
                'exists' => 'Selected medicine does not exist'
            ],
            'description' => [
                'max' => 'Description is too long'
            ],
            'stock' => [
                'required' => 'Stock quantity is required',
                'numeric' => 'Stock must be a number'
            ],
            'dosage' => [
                'required' => 'Dosage is required',
                'numeric' => 'Dosage must be a number'
            ],
            'start_date' => [
                'required' => 'Start date is required',
                'date' => 'Invalid start date'
            ],
            'end_date' => [
                'required' => 'End date is required',
                'date' => 'Invalid end date',
                'after' => 'End date must be after start date'
            ],
            'reminder_time1' => [
                'required' => 'At least one reminder time is required',
                'date_format' => 'Invalid reminder time format'
            ],
            'reminder_time2' => [
                'date_format' => 'Invalid reminder time format'
            ],
            'reminder_time3' => [
                'date_format' => 'Invalid reminder time format'
            ],
            'reminder_time4' => [
                'date_format' => 'Invalid reminder time format'
            ],
            'reminder_time5' => [
                'date_format' => 'Invalid reminder time format'
            ],
            'restock' => [
                'date' => 'Invalid restock date'
            ],
            'restock_reminder' => [
                'numeric' => 'Restock reminder must be a number'
            ],
            'repeat' => [
                'integer' => 'Repeat interval must be in days'
            ]
        ]
    ],
    'errors' => [
        'auth' => 'Authentication error',
        'input' => 'Input error',
        'data' => 'Data error'
    ]
];