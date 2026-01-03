# Expense Tracker App (Bangla)

A simple and easy-to-use Expense Tracker application built with Django (Backend) and React (Frontend).

## Setup Instructions

### Backend
1. Go to the project root.
2. Activate virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Run migrations (already done, but good to know):
   ```bash
   python manage.py migrate
   ```
4. Run the server:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Go to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Key Features
- **Bangla Interface**: All text and labels are in Bangla.
- **Category Management**: Pre-seeded categories like Food, Transport, Rent, etc.
- **Date Filtering**: Easily filter expenses by date.
- **Balance Tracking**: Real-time calculation of income vs expense.
