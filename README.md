# GoPass Task Manager

Sistema de gestión de tareas y proyectos full-stack con Backend (NestJS), Frontend (Next.js) y Mobile (Flutter).

## Descripción

GoPass Task Manager es una aplicación completa para la gestión de proyectos y tareas que permite:

- **Registro e inicio de sesión** de usuarios
- **Crear, editar y eliminar proyectos**
- **Crear, editar y eliminar tareas** dentro de cada proyecto
- **Cambiar el estado de las tareas** (Pendiente, En Progreso, Completada, Cancelada)
- **Segmentación por usuario** - cada usuario solo ve sus propios proyectos

## Estructura del Proyecto

```
Test_Gopass/
├── docker-compose.yml          # Orquestación de servicios
├── TestGopassBackend/          # API REST con NestJS
├── TestGopassFrontend/         # Aplicación web con Next.js
└── TestGopassMobile/           # Aplicación móvil con Flutter
```

## Tecnologías

### Backend
- **NestJS** con TypeScript
- **PostgreSQL** como base de datos
- **Redis** para caché
- **TypeORM** para operaciones de base de datos
- **JWT** para autenticación
- **CQRS** patrón para separación de comandos/consultas
- **Swagger** para documentación de API
- **Arquitectura Hexagonal**

### Frontend
- **Next.js 14** con React 18
- **TypeScript**
- **TailwindCSS** para estilos
- **Zustand** para manejo de estado
- **Atomic Design** patrón de diseño
- **Arquitectura Hexagonal**

### Mobile
- **Flutter**
- **BLoC** patrón para manejo de estado
- **Dio** para peticiones HTTP
- **GetIt** para inyección de dependencias
- **Arquitectura Hexagonal**

## Inicio Rápido con Docker

### Prerrequisitos
- Docker y Docker Compose instalados
- Flutter SDK 3.0+ (solo para la app móvil)

### Pasos para ejecutar

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Test_Gopass
```

2. **Iniciar todos los servicios con Docker**
```bash
docker-compose up -d --build
```

3. **Verificar que los servicios estén corriendo**
```bash
docker-compose ps
```

4. **Acceder a las aplicaciones**
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs

5. **Detener los servicios**
```bash
docker-compose down
```

### Reiniciar servicios después de cambios
```bash
docker-compose restart backend frontend
```

## Ejecutar la Aplicación Móvil (Flutter)

```bash
cd TestGopassMobile
flutter pub get
flutter run -d chrome    # Para web
flutter run -d android   # Para Android
flutter run -d ios       # Para iOS
```

**Nota:** La app móvil se conecta al backend en `http://10.0.2.2:3000` (Android emulator) o `http://localhost:3000` (Web).

## Endpoints de la API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Registrar nuevo usuario |
| POST | `/api/v1/auth/login` | Iniciar sesión |
| POST | `/api/v1/auth/logout` | Cerrar sesión |
| POST | `/api/v1/auth/refresh` | Refrescar token |
| GET | `/api/v1/auth/me` | Obtener usuario actual |

### Proyectos (requiere autenticación)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/projects` | Obtener proyectos del usuario |
| GET | `/api/v1/projects/:id` | Obtener proyecto por ID |
| POST | `/api/v1/projects` | Crear proyecto |
| PUT | `/api/v1/projects/:id` | Actualizar proyecto |
| DELETE | `/api/v1/projects/:id` | Eliminar proyecto |

### Tareas (requiere autenticación)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Obtener todas las tareas |
| GET | `/api/v1/tasks/:id` | Obtener tarea por ID |
| GET | `/api/v1/tasks/project/:projectId` | Obtener tareas por proyecto |
| POST | `/api/v1/tasks` | Crear tarea |
| PUT | `/api/v1/tasks/:id` | Actualizar tarea |
| DELETE | `/api/v1/tasks/:id` | Eliminar tarea |

## Ejecutar Tests

```bash
# Backend
cd TestGopassBackend
npm run test

# Frontend
cd TestGopassFrontend
npm run test

# Mobile
cd TestGopassMobile
flutter test
```

## Variables de Entorno

Las variables de entorno están configuradas en `docker-compose.yml` para el entorno de desarrollo.

### Backend
| Variable | Valor | Descripción |
|----------|-------|-------------|
| DATABASE_HOST | postgres | Host de PostgreSQL |
| DATABASE_PORT | 5432 | Puerto de PostgreSQL |
| DATABASE_USER | gopass_user | Usuario de BD |
| DATABASE_PASSWORD | gopass_password | Contraseña de BD |
| DATABASE_NAME | gopass_tasks | Nombre de BD |
| REDIS_HOST | redis | Host de Redis |
| REDIS_PORT | 6379 | Puerto de Redis |

### Frontend
| Variable | Valor | Descripción |
|----------|-------|-------------|
| NEXT_PUBLIC_API_URL | http://localhost:3000/api/v1 | URL del Backend |

## Arquitectura

Los tres proyectos siguen principios de **Arquitectura Hexagonal**:

```
├── domain/           # Entidades, lógica de negocio, interfaces de repositorios
├── application/      # Casos de uso, comandos, queries, handlers
└── infrastructure/   # Adaptadores de BD, clientes API, servicios externos
```

## Patrones de Diseño Utilizados

- **SOLID** - Principios de diseño orientado a objetos
- **Dependency Injection** - Inyección de dependencias
- **CQRS** - Separación de comandos y consultas (Backend)
- **BLoC** - Business Logic Component (Mobile)
- **Atomic Design** - Diseño atómico de componentes (Frontend)
- **Repository Pattern** - Patrón repositorio
- **Adapter Pattern** - Patrón adaptador

## Características de Seguridad

- Autenticación con **JWT** (JSON Web Tokens)
- Contraseñas hasheadas con **bcrypt**
- Segmentación de datos por usuario
- Validación de datos en backend

## Interfaz de Usuario

La aplicación utiliza un esquema de colores **verde y negro**:
- Verde primario: `#22C55E`
- Negro primario: `#0A0A0A`

## Autor

Desarrollado como prueba técnica para GoPass.
