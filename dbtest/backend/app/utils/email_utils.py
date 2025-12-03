from fastapi import HTTPException
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import SMTP_EMAIL, SMTP_PASSWORD

def send_otp_email(receiver_email: str, otp: str, purpose: str):
    sender_email = SMTP_EMAIL
    sender_password = SMTP_PASSWORD

    if purpose == "register":
        subject = "Your Registration OTP Code"
        body = f"""
        <h2>Account Verification OTP</h2>
        <p>Welcome! Your 6-digit OTP code for registration is:</p>
        <h1>{otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        """
    else:
        subject = "Your Password Reset OTP"
        body = f"""
        <h2>Password Reset OTP</h2>
        <p>Your 6-digit OTP code is:</p>
        <h1>{otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        """

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        print(f"OTP sent to {receiver_email}")
    except Exception as e:
        print("Email failed:", e)
        raise HTTPException(status_code=500, detail=f"Email sending failed: {e}")
