<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            margin: 0;
            padding: 40px;
            font-family: 'Lato', sans-serif;
            color: white;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background-color: #225b7c;
            border-radius: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        h2 {
            color: #ecf8ff;
            font-size: 28px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 30px;
        }

        p {
            color: white;
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0;
        }

        .medicine-name {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.15);
            color: #ecf8ff;
            font-size: 20px;
            padding: 8px 20px;
            border-radius: 20px;
            margin: 5px;
        }
    </style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
    <div class="container">
        <h2>Medicine Reminder</h2>
        <p>Time to take your medicine:</p>
        <div class="medicine-name">
            {{ $medicineName }}
        </div>
        <p>Dosage: {{ $dosage }} {{ $dosage_unit }}</p>
        @if($description)
            <p>Note: {{ $description }}</p>
        @endif
        <p>Scheduled time: {{ $reminderTime }}</p>
    </div>
</body>
</html>