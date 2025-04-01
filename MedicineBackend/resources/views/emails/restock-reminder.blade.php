<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        :root {
            color-scheme: light only;
        }

        body {
            margin: 0;
            padding: 40px;
            font-family: 'Lato', sans-serif;
            color: white !important;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background-color: #1a2f4b !important;
            border-radius: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        h2 {
            color: white !important;
            font-size: 28px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 30px;
        }

        p {
            color: white !important;
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0;
        }

        .medicine-name {
            display: inline-block;
            background-color: #4a9eff !important;
            color: white !important;
            font-size: 20px;
            padding: 8px 20px;
            border-radius: 20px;
            margin: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Medicine Restock Reminder</h2>
        <div class="medicine-name">
            {{ $medicineName }}
        </div>
        <p>Your medicine is running low!</p>
        <p>Current stock: {{ $stock }} {{ $dosage_unit }}</p>
        <p>Please remember to restock by: {{ $restockDate }}</p>
    </div>
</body>
</html>