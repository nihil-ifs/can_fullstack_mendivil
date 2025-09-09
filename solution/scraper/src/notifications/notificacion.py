import smtplib
from email.mime.text import MIMEText

SMTP_SERVER = "mailhog"
SMTP_PORT = 1025
FROM_EMAIL = "no-reply@sgcan.org"

def enviar_notificaciones_masivas(subject: str, body: str, recipients: list[str]):
    msg = MIMEText(body, "plain")
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        for recipient in recipients:
            msg["To"] = recipient
            server.sendmail(FROM_EMAIL, recipient, msg.as_string())
            print(f"[notificaciones] Email enviado a {recipient}")
