from pydantic import BaseModel, EmailStr, Field

# ------------------- Registration Schemas -------------------

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class RegisterVerifyRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=4, max_length=6)


# ------------------- Login Schema -------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ------------------- Forgot / Reset Password Schemas -------------------

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=4, max_length=6)


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=4, max_length=6)
    new_password: str = Field(..., min_length=6, max_length=100)
