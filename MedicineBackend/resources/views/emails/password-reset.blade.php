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

        .reset-button {
            display: inline-block;
            background-color: #4a9eff !important;
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
            color: white !important;
            font-size: 14px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset</h2>
        <p>We received a password reset request for your account.</p>
        <p>Click the button below to continue:</p>
        <a href="http://localhost:4200/passreset?token={{ urlencode($token) }}&email={{ urlencode($email) }}" class="reset-button">
            Reset Password
        </a>
        <p class="footer">If you didn't request a password reset, please ignore this email.</p>
    </div>
</body>
</html>