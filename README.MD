# 🎓 IYIP Platform

**IYIP Platform** adalah aplikasi web manajemen akademik full-stack yang dikembangkan untuk **ITENAS (Institut Teknologi Nasional)**. Platform ini menghubungkan mahasiswa, peneliti, dan komunitas akademik melalui sistem manajemen event, jurnal digital, komunitas, dan submission material/fasilitas dalam satu ekosistem terintegrasi.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-lightblue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#️-tech-stack)
- [Struktur Project](#-struktur-project)
- [Skema Database (ERD)](#-skema-database-erd)
- [Autentikasi & Otorisasi](#-autentikasi--otorisasi)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Default User (Seed Data)](#-default-user-seed-data)
- [Known Issues & Improvement](#-known-issues--improvement)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🎯 Tentang Project

IYIP Platform dibangun sebagai solusi manajemen akademik berbasis web dengan arsitektur **RESTful API** (Spring Boot) di sisi backend dan **Single Page Application** (React.js) di sisi frontend. Project ini mendemonstrasikan implementasi enterprise-grade meliputi autentikasi JWT, role-based access control, relational database design, serta integrasi penuh antara backend dan frontend melalui REST API.

---

## ✨ Fitur Utama

✅ **Autentikasi & Otorisasi** — Login/register dengan JWT, role-based access (Admin & User)
✅ **Event Management** — Pembuatan event, pendaftaran, dan pembatalan pendaftaran event
✅ **Digital Journal** — Publikasi jurnal akademik dengan visibilitas publik/privat
✅ **Community System** — Pembuatan komunitas, join/leave, dan manajemen anggota
✅ **Submission Workflow** — Pengajuan material & fasilitas dengan status approval (pending/approved/rejected)
✅ **User Management** — Manajemen profil pengguna dan administrasi user oleh Admin
✅ **Admin Dashboard** — Panel khusus admin untuk review submission dan kelola pengguna

---

## 🛠️ Tech Stack

### Backend
| Teknologi | Keterangan |
|---|---|
| Java 17 | Bahasa pemrograman utama |
| Spring Boot 3.5.0 | Framework backend |
| Spring Security | Autentikasi & otorisasi |
| Spring Data JPA / Hibernate | ORM & database access layer |
| MySQL | Relational database |
| JWT (jjwt 0.11.5) | Token-based authentication |
| Lombok | Mengurangi boilerplate code |
| Gradle (Kotlin DSL) | Build automation tool |
| H2 Database | In-memory database untuk testing |
| JUnit 5 | Unit & integration testing |

### Frontend
| Teknologi | Keterangan |
|---|---|
| React 18.2.0 | Library UI utama |
| React Router DOM 6.15 | Client-side routing |
| Axios | HTTP client untuk konsumsi REST API |
| Bootstrap 5.3.6 / React Bootstrap | Styling & komponen UI |
| FontAwesome | Icon set |
| Context API | State management (autentikasi) |

---

## 📂 Struktur Project

```
iyip-platform/
├── src/
│   ├── main/
│   │   ├── java/com/itenas/iyip_platform/
│   │   │   ├── config/              # Konfigurasi Security, CORS, Data Initializer
│   │   │   ├── controller/          # REST Controller (Auth, User, Event, Journal, Submission, Community)
│   │   │   ├── dto/
│   │   │   │   ├── request/         # DTO untuk request payload
│   │   │   │   └── response/        # DTO untuk response payload (ApiResponse, dll)
│   │   │   ├── entity/              # JPA Entity (User, Event, Journal, Submission, Community, Role, dll)
│   │   │   │   └── base/            # BaseEntity (auditing/common fields)
│   │   │   ├── repository/          # Spring Data JPA Repository
│   │   │   ├── security/            # JWT Provider, Filter, UserDetailsImpl
│   │   │   └── service/             # Business logic layer
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/              # Landing page statis (index.html, css, js)
│   └── test/                        # Unit & integration test
├── frontend/
│   ├── src/
│   │   ├── pages/                   # Halaman: Home, Login, Register, Dashboard, Journals,
│   │   │                              Events, Submissions, Communities, UserManagement, dll
│   │   ├── components/              # Komponen reusable (Navbar, dll)
│   │   ├── contexts/                # AuthContext (state autentikasi global)
│   │   ├── services/                # API service layer (axios wrapper per modul)
│   │   ├── styles/                  # File CSS global
│   │   ├── App.js                   # Routing utama & Protected/Admin Route
│   │   └── index.js                 # Entry point React
│   ├── package.json
│   └── .env                         # Konfigurasi environment frontend
├── build.gradle.kts                 # Konfigurasi build backend
└── README.md
```

---

## 🗄️ Skema Database (ERD)

Database dirancang dengan 7 entitas utama yang saling berelasi:

- **Users** ↔ **Roles** (Many-to-One) — setiap user memiliki satu role (ADMIN/USER)
- **Users** ↔ **Events** (Many-to-Many via `EventRegistration`) — pendaftaran event
- **Users** ↔ **Communities** (Many-to-Many via `UserCommunity`) — keanggotaan komunitas
- **Users** → **Journals** (One-to-Many) — kepemilikan jurnal
- **Users** → **Submissions** (One-to-Many) — kepemilikan submission

Diagram TRD dan ERD lengkap tersedia pada file `TRD.png` dan `ERD.png` di repository.

---

## 🔐 Autentikasi & Otorisasi

- Autentikasi berbasis **JWT (HS512)** dengan masa berlaku token dapat dikonfigurasi (`app.jwtExpirationInMs`)
- **Stateless session** — tidak menggunakan session di server, token dikirim melalui header `Authorization: Bearer <token>`
- **Role-based access control** menggunakan `@PreAuthorize`:
  - Endpoint publik: `/api/auth/**`, `/api/events/**` (GET), `/api/communities/**` (GET), `/api/journals/public`
  - Endpoint khusus **ADMIN**: `/api/admin/**`, pembuatan event/komunitas, review submission
  - Endpoint terautentikasi: profil user, journal pribadi, submission pribadi
- Custom `JwtAuthenticationFilter` dan `JwtAuthenticationEntryPoint` untuk validasi token dan penanganan unauthorized request

---

## 🚀 Getting Started

### Prasyarat
- Java 17+
- Node.js & npm
- MySQL Server (database `crud_iyip` akan dibuat otomatis)
- Gradle (sudah include via wrapper)

### Menjalankan Backend
```bash
# Clone repository
git clone <repository-url>
cd iyip-platform

# Konfigurasi koneksi database di src/main/resources/application.properties
# (sesuaikan username & password MySQL)

# Jalankan aplikasi
./gradlew bootRun
```
Server backend berjalan di `http://localhost:8080`

### Menjalankan Frontend
```bash
cd frontend
npm install
npm start
```
Aplikasi frontend berjalan di `http://localhost:3000` dan terhubung ke backend melalui `REACT_APP_API_URL` pada file `.env`

---

## 📡 API Endpoints

| Modul | Endpoint | Method | Akses |
|---|---|---|---|
| Auth | `/api/auth/login`, `/api/auth/register` | POST | Publik |
| User | `/api/users/profile` | GET/PUT | Authenticated |
| User | `/api/users` | GET | Admin |
| Event | `/api/events` | GET | Publik |
| Event | `/api/events` | POST/PUT | Admin |
| Event | `/api/events/{id}/register` | POST/DELETE | Authenticated |
| Journal | `/api/journals/public` | GET | Publik |
| Journal | `/api/journals`, `/api/journals/my-journals` | POST/GET | Authenticated |
| Community | `/api/communities` | GET | Publik |
| Community | `/api/communities/{id}/join`, `/leave` | POST/DELETE | Authenticated |
| Submission | `/api/submissions` | POST | Authenticated |
| Submission | `/api/submissions/by-status/**` | GET | Admin |

---

## 🔑 Default User (Seed Data)

Aplikasi menyediakan data awal (`DataInitializer`) untuk keperluan development/testing:

| Role | Email | Password |
|---|---|---|
| Admin | admin@iyip.com | admin123 |
| Admin | admina@iyip.com | admina123 |
| User | usera@iyip.com | usera123 |
| User | user@iyip.com | user123 |

> ⚠️ Data ini hanya untuk keperluan development lokal dan **tidak boleh digunakan di environment production**.

---

## ⚠️ Known Issues & Improvement

- Password saat ini menggunakan `NoOpPasswordEncoder` (plain text) — perlu diganti dengan `BCryptPasswordEncoder` sebelum deployment ke production
- JWT secret key sebaiknya dipindahkan ke environment variable, bukan hardcoded di `application.properties`
- Penambahan refresh token untuk meningkatkan keamanan sesi
- Penambahan unit test coverage pada service layer

---

## 🤝 Kontribusi

Kontribusi sangat terbuka! Silakan fork repository ini, buat branch baru, dan ajukan pull request.

1. Fork project
2. Buat branch fitur (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur X'`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Ajukan Pull Request

---

## 📄 Lisensi

Project ini dikembangkan untuk keperluan akademik di **ITENAS (Institut Teknologi Nasional)**.

---

## 👤 Author

Dikembangkan oleh **By1Frost**