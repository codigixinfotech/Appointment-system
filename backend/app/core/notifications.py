import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger("app.notifications")
logger.setLevel(logging.INFO)

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

def send_email_via_smtp(to_email: str, subject: str, body: str, is_html: bool = False):
    """
    Sends an email using configured SMTP settings.
    Falls back to logging/console print if SMTP is not fully configured.
    """
    if not (settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD):
        logger.warning("SMTP is not fully configured. Email was not sent via network. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in .env to enable real email sending.")
        return False

    from_email = settings.SMTP_FROM or settings.SMTP_USER
    
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'html' if is_html else 'plain'))
    
    try:
        # Connect to server
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.ehlo()
        # If port is 587, use STARTTLS
        if settings.SMTP_PORT == 587:
            server.starttls()
            server.ehlo()
        
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(from_email, to_email, msg.as_string())
        server.close()
        
        logger.info(f"Successfully sent email to {to_email} via SMTP ({settings.SMTP_HOST})")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email} via SMTP: {e}")
        return False

def send_appointment_email(doctor_email: str, patient_email: str, appointment_details: dict):
    subject = f"Appointment Confirmed: {appointment_details['date']} at {appointment_details['time_slot']}"
    
    hospital_name = appointment_details.get('hospital_name', 'Clinic Administration')
    hospital_logo = appointment_details.get('hospital_logo', '')
    
    logo_html = f'<div style="text-align: center; margin-bottom: 20px;"><img src="{hospital_logo}" alt="{hospital_name} Logo" style="max-height: 80px; max-width: 200px;"></div>' if hospital_logo else ''
    
    # HTML template for the patient
    patient_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            {logo_html}
            <h2 style="color: #2b6cb0; text-align: center;">Appointment Confirmation</h2>
            <p style="font-size: 16px;">Dear <strong>{appointment_details['patient_name']}</strong>,</p>
            <p>Your appointment with <strong>Dr. {appointment_details['doctor_name']}</strong> at <strong>{hospital_name}</strong> has been successfully scheduled. Below are your appointment details:</p>
            
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. {appointment_details['doctor_name']} ({appointment_details['doctor_speciality']})</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> {appointment_details['date']}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> {appointment_details['time_slot']}</p>
                <p style="margin: 5px 0;"><strong>Consultation Type:</strong> {appointment_details['type']}</p>
            </div>
            
            <p>If you need to reschedule or have any questions, please contact our support.</p>
            <p>Thank you for choosing our service! We wish you good health.</p>
            
            <br>
            <p style="font-size: 14px; color: #777;">Best Regards,<br><strong>{hospital_name}</strong></p>
        </div>
      </body>
    </html>
    """

    # HTML template for the doctor
    doctor_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            {logo_html}
            <h2 style="color: #2f855a; text-align: center;">New Appointment Scheduled</h2>
            <p style="font-size: 16px;">Hello <strong>Dr. {appointment_details['doctor_name']}</strong>,</p>
            <p>A new appointment has been scheduled with you at <strong>{hospital_name}</strong>. Here are the details of your upcoming consultation:</p>
            
            <div style="background-color: #f0fff4; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #276749;">Appointment Info</h3>
                <p style="margin: 5px 0;"><strong>Date:</strong> {appointment_details['date']}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> {appointment_details['time_slot']}</p>
                <p style="margin: 5px 0;"><strong>Type:</strong> {appointment_details['type']}</p>
                
                <h3 style="margin-top: 20px; margin-bottom: 10px; color: #276749;">Patient Details</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> {appointment_details['patient_name']} (Age: {appointment_details['patient_age']}, Gender: {appointment_details['patient_gender']})</p>
                <p style="margin: 5px 0;"><strong>Contact:</strong> {appointment_details['patient_mobile']} | {patient_email}</p>
                <p style="margin: 5px 0;"><strong>Reason / Symptoms:</strong> {appointment_details['patient_description']}</p>
            </div>
            
            <p>Please review the details prior to the consultation.</p>
            
            <br>
            <p style="font-size: 14px; color: #777;">Best Regards,<br><strong>{hospital_name} System</strong></p>
        </div>
      </body>
    </html>
    """
    
    # 1. Print visual log output to backend terminal
    print("=" * 60)
    print("SIMULATING EMAIL DELIVERY (HTML FORMAT)")
    print("=" * 60)
    print(f"TO PATIENT ({patient_email}):")
    print(f"Subject: {subject}")
    print("... (HTML content printed to logs internally) ...")
    print("-" * 60)
    print(f"TO DOCTOR ({doctor_email}):")
    print(f"Subject: {subject}")
    print("... (HTML content printed to logs internally) ...")
    print("=" * 60)

    # 2. Attempt real SMTP sending for Patient
    patient_smtp_success = send_email_via_smtp(patient_email, subject, patient_body, is_html=True)

    # 3. Attempt real SMTP sending for Doctor
    doctor_smtp_success = send_email_via_smtp(doctor_email, subject, doctor_body, is_html=True)
    
    if patient_smtp_success and doctor_smtp_success:
        logger.info("Emails sent successfully via SMTP to both patient and doctor.")
    else:
        logger.info("Emails printed to terminal console logs (set SMTP credentials in .env to send real network emails).")
