<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jelszó visszaállítás</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Lato', sans-serif;
        }

        body {
            background-color: #ecf8ff;
            padding: 40px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background-color: white;
            border-radius: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.30);
            text-align: center;
        }

        h2 {
            color: #225b7c;
            font-size: 30px;
            font-weight: 700;
            margin-bottom: 30px;
            letter-spacing: 0.3px;
        }

        p {
            color: #6c757d;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .reset-button {
            display: inline-block;
            background-color: #225b7c;
            color: white !important; 
            padding: 12px 40px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            border: none;
        }

        .footer {
            color: #6c757d;
            font-size: 14px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Jelszó Visszaállítás</h2>
        <p>Jelszó visszaállítási kérelmet kaptunk a fiókodhoz.</p>
        <p>Kattints az alábbi gombra a folytatáshoz:</p>
        <a href="http://localhost:4200/passreset?token={{ urlencode($token) }}&email={{ urlencode($email) }}" class="reset-button">
            Jelszó visszaállítása
        </a>
        <p class="footer">Ha nem te kérted a jelszó visszaállítását, hagyd figyelmen kívül ezt az e-mailt.</p>
    </div>
</body>
</html>