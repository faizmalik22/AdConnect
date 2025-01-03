from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from .configs import MailConfig


def send_email(to, subject, content_body):
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = MailConfig.SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html'))

    client = smtplib.SMTP(host=MailConfig.SMTP_SERVER, port=MailConfig.SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()
