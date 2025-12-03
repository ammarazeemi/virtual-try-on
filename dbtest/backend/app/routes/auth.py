from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import (
    RegisterRequest,
    RegisterVerifyRequest,
    LoginRequest,
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest
)
from app.utils.hashing import hash_password, verify_password
from app.utils.email_utils import send_otp_email
from app.database import get_connection
import secrets
import time

router = APIRouter()

# ------------------- REGISTER REQUEST -------------------
@router.post("/register-request")
def register_request(data: RegisterRequest):
    conn = get_connection()
    c = conn.cursor()
    try:
        # Check if email already exists
        c.execute("SELECT * FROM users WHERE email=?", (data.email,))
        if c.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")

        # Ensure pending_users table exists
        c.execute("""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pending_users' AND xtype='U')
            CREATE TABLE pending_users (
                id INT IDENTITY(1,1) PRIMARY KEY,
                name NVARCHAR(100),
                email NVARCHAR(255) UNIQUE,
                password NVARCHAR(255),
                otp NVARCHAR(10),
                expires_at DATETIME
            )
        """)
        conn.commit()

        otp = f"{secrets.randbelow(1000000):06d}"  # 6-digit OTP
        hashed = hash_password(data.password)

        # Remove old pending user if exists
        c.execute("DELETE FROM pending_users WHERE email=?", (data.email,))

        # Insert new pending user
        c.execute("""
            INSERT INTO pending_users (name, email, password, otp, expires_at)
            VALUES (?, ?, ?, ?, DATEADD(MINUTE, 10, GETDATE()))
        """, (data.name, data.email, hashed, otp))
        conn.commit()

        # Send OTP
        send_otp_email(data.email, otp, "register")
        return {"message": f"OTP sent to {data.email}"}

    finally:
        conn.close()


# ------------------- REGISTER VERIFY -------------------
@router.post("/register-verify")
def register_verify(data: RegisterVerifyRequest):
    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute("SELECT name, email, password, otp, expires_at FROM pending_users WHERE email=?", (data.email,))
        row = c.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="No pending registration found")

        name, email, password, db_otp, expires_at = row
        if db_otp != data.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        # Expiry check
        if time.time() > (expires_at.timestamp() if hasattr(expires_at, "timestamp") else time.mktime(expires_at.timetuple())):
            raise HTTPException(status_code=400, detail="OTP expired")

        # Move to main users table
        c.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, password))
        conn.commit()

        # Delete pending record
        c.execute("DELETE FROM pending_users WHERE email=?", (data.email,))
        conn.commit()

        return {"message": "Registration verified successfully"}
    finally:
        conn.close()


# ------------------- LOGIN -------------------
# @router.post("/login")
# def login_user(data: LoginRequest):
#     conn = get_connection()
#     c = conn.cursor()
#     try:
#         c.execute("SELECT * FROM users WHERE email=?", (data.email,))
#         user = c.fetchone()
#         if not user or not verify_password(data.password, user[3]):
#             raise HTTPException(status_code=400, detail="Invalid email or password")
#
#         return {"message": "Login successful", "name": user[1], "email": user[2]}
#     finally:
#         conn.close()
# ------------------- LOGIN -------------------
@router.post("/login")
def login_user(data: LoginRequest):
    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute("SELECT * FROM users WHERE email=?", (data.email,))
        user = c.fetchone()
        print(user)
        if not user or not verify_password(data.password, user[3]):
            raise HTTPException(status_code=400, detail="Invalid email or password")

        # user = (id, name, email, password)
        return {
            "message": "Login successful",
            "user_id": user[0],
            "name": user[1],
            "email": user[2]
        }
    finally:
        conn.close()


# ------------------- FORGOT PASSWORD -------------------
@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    conn = get_connection()
    c = conn.cursor()
    try:
        # Check user exists
        c.execute("SELECT id FROM users WHERE email=?", (req.email,))
        row = c.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Email not found")

        user_id = row[0]
        otp = f"{secrets.randbelow(1000000):06d}"

        # Ensure OTP table exists
        c.execute("""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='otps' AND xtype='U')
            CREATE TABLE otps (
                id INT IDENTITY(1,1) PRIMARY KEY,
                user_id INT,
                otp NVARCHAR(10),
                created_at DATETIME,
                expires_at DATETIME
            )
        """)
        conn.commit()

        # Insert new OTP
        c.execute("""
            INSERT INTO otps (user_id, otp, created_at, expires_at)
            VALUES (?, ?, GETDATE(), DATEADD(MINUTE, 10, GETDATE()))
        """, (user_id, otp))
        conn.commit()

        send_otp_email(req.email, otp, "reset")
        return {"message": f"OTP sent to {req.email}"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        conn.close()


# ------------------- VERIFY OTP -------------------
@router.post("/verify-otp")
def verify_otp(req: VerifyOTPRequest):
    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute("SELECT id FROM users WHERE email=?", (req.email,))
        row = c.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Email not found")
        user_id = row[0]

        c.execute("""
            SELECT TOP 1 otp, expires_at
            FROM otps
            WHERE user_id=?
            ORDER BY id DESC
        """, (user_id,))
        row = c.fetchone()
        if not row:
            raise HTTPException(status_code=400, detail="No OTP found. Request a new one.")

        db_otp, expires_at = row
        if time.time() > (expires_at.timestamp() if hasattr(expires_at, "timestamp") else time.mktime(expires_at.timetuple())):
            raise HTTPException(status_code=400, detail="OTP expired")

        if db_otp != req.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        return {"message": "OTP verified"}
    finally:
        conn.close()


# ------------------- RESET PASSWORD -------------------
@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute("SELECT id FROM users WHERE email=?", (req.email,))
        row = c.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Email not found")
        user_id = row[0]

        # fetch latest otp
        c.execute("""
            SELECT TOP 1 otp, expires_at
            FROM otps
            WHERE user_id=?
            ORDER BY id DESC
        """, (user_id,))
        row = c.fetchone()
        if not row:
            raise HTTPException(status_code=400, detail="No OTP found")

        db_otp, expires_at = row
        if time.time() > (expires_at.timestamp() if hasattr(expires_at, "timestamp") else time.mktime(expires_at.timetuple())):
            raise HTTPException(status_code=400, detail="OTP expired")

        if db_otp != req.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        # Update password
        hashed = hash_password(req.new_password)
        c.execute("UPDATE users SET password=? WHERE id=?", (hashed, user_id))
        conn.commit()

        # Delete used OTPs
        c.execute("DELETE FROM otps WHERE user_id=?", (user_id,))
        conn.commit()

        return {"message": "Password reset successful"}
    finally:
        conn.close()
