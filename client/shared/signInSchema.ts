**Purpose**: Defines validation schema for user sign-in.

**Key Features**:
- Validates username (2-20 characters, trimmed, lowercase)
- Enforces complex password requirements:
  - Minimum 8 characters
  - Maximum 100 characters
  - Must contain at least one uppercase letter
  - Must contain at least one lowercase letter
  - Must contain at least one digit
  - Must contain at least one special character
- Uses regex patterns for character validation