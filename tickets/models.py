from django.db import models
from users.models import User  # Asegúrate de que la aplicación 'users' esté instalada

class Ticket(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Mid', 'Mid'),
        ('Low', 'Low'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Solved', 'Solved'),
    ]

    ticket_id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=30)
    description = models.CharField(max_length=100)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    ticket_date = models.DateTimeField(auto_now_add=True)
    ticket_due_date = models.DateTimeField(null=True, blank=True)
    ticket_close_date = models.DateTimeField(null=True, blank=True)
    phase = models.PositiveSmallIntegerField()
    assignor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tickets')
    assignee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_tickets')

    class Meta:
        db_table = 'tic_Tickets'

    def __str__(self):
        return f"Ticket {self.ticket_id} - {self.subject}"

class Report(models.Model):
    reports_id = models.AutoField(primary_key=True)
    solution = models.CharField(max_length=200)
    results = models.CharField(max_length=200)
    suggestions = models.CharField(max_length=200)
    report_date = models.DateTimeField(auto_now_add=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='reports')

    class Meta:
        db_table = 'tic_Reports'

    def __str__(self):
        return f"Report {self.reports_id} for Ticket {self.ticket.ticket_id}"
