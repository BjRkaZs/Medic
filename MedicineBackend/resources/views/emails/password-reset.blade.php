<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jelszó visszaállítás</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
        }
        .token {
            background-color: #eee;
            padding: 10px;
            border-radius: 3px;
            font-family: monospace;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h2>Kedves Felhasználó!</h2>
    <p>Jelszó visszaállítási kérelmet kaptunk a fiókodhoz.</p>
    <p>A jelszavad visszaállításához kattints az alábbi linkre:</p>
    <a href="http://localhost:4200/passreset?token={{ $token }}&email={{ $email }}">
        Jelszó visszaállítása
    </a>
    <p>Ha nem te kérted a jelszó visszaállítását, hagyd figyelmen kívül ezt az e-mailt.</p>
</body>
</html>