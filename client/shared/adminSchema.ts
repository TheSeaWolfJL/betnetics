**Purpose**: Defines validation schema for admin user registration/creation.

**Key Features**:
- Validates email format with Russian error messages
- Enforces first name length constraints (2-50 characters)
- Complex birth date validation:
  - Format: DD.MM.YYYY
  - Validates date validity (leap years, month lengths)
  - Restricts age range: 1 year to 120 years ago from current date
- Uses Zod's refine method for custom validation logic