<!DOCTYPE html>
<html>
<body>
    <h2>Medicine Reminder</h2>
    <p>Time to take your medicine: {{ $medicineName }}</p>
    <p>Dosage: {{ $dosage }}</p>
    @if($description)
        <p>Note: {{ $description }}</p>
    @endif
    <p>Scheduled time: {{ $reminderTime }}</p>
</body>
</html>