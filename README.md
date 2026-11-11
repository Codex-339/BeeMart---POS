# BeeMart — Full-Stack Point of Sale (POS) & Inventory System

BeeMart is a full-stack Point of Sale (POS) and inventory management web application built with a decoupled architecture. Designed to support multi-role store operations for Admins and Cashiers, BeeMart provides end-to-end features including user authentication, product management, checkout processing, payment handling, and transaction history tracking.

---

## Key Features

- **Authentication & User Onboarding:** Secure Login and User Registration modules with Role-Based Access Control, customized for Admin operations and Cashier workflows.
- **Database Design & Data Seeding:** Relational database schema on SQL Server with indexed transaction queries (`UserID` + `TransactionDate` + `InvoiceNo`) and relational seed data across multiple product categories.
- **Checkout & Invoice Engine:** Real-time product search, running totals, payment method selection, and automatic unique invoice generation.
- **Invoice Tracking & Records:** Interactive transaction history lookup with date range filtering, detailed invoice inspection, and server-side API pagination (optimized at 20 records per page).

---

## Tech Stack & Architecture

- **Backend:** .NET 8 ASP.NET Core Web API (`BeeMart.API`)
- **Frontend:** ASP.NET Core Web Client (`BeeMart.WebClient`) built with Native CSS & Segoe UI typography
- **Database:** Microsoft SQL Server (`BeeMartDB`)
- **Architecture:** Decoupled API-driven architecture using RESTful HTTP/JSON endpoints

---

## Technical Highlights

- **Decoupled Architecture:** Full separation between backend API (`BeeMart.API`) and frontend client (`BeeMart.WebClient`), handling all data exchange via RESTful HTTP JSON endpoints.
- **Custom Native UI:** Clean and responsive user interface, built natively with custom CSS and Segoe UI font
- **Input Validation & Business Constraints:** Client and server-side validation checks via API requests to ensure data integrity, including database credential & role verification during authentication, stock availability checks, and quantity limits.

---

## Getting Started

### Prerequisites
- .NET 8 SDK
- Microsoft SQL Server & SQL Server Management Studio (SSMS)

### Database Setup
1. Open SSMS and execute the provided database setup script (`BeeMartDB.sql`).
2. Update the connection string in `BeeMart.API/appsettings.json` to match your local SQL Server instance.

### Running the Application

1. **Start Backend API & Frontend WebClient:**
   ```bash
   # Terminal 1 (Backend API)
   cd BeeMart.API
   dotnet build
   dotnet run

   # Terminal 2 (Frontend WebClient)
   cd BeeMart.WebClient
   dotnet build
   dotnet run
   ```

2. **Open Browser:**
   Open your browser and navigate to `http://localhost:5235`

3. **Login with Registered Accounts:**

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `123456` |
| **Cashier** | `steven` | `123456` |
