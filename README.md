# ⚛️ React Cognito Auth - Fronten

Aplicación React con TypeScript que implementa autenticación completa usando AWS Cognito, incluyendo Multi-Factor Authentication (MFA) mediante TOTP (Google Authenticator, Authy, etc.)

## 📋 Tabla de Contenidos
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación Rápida](#-instalación-rápida)
- [Configuración de AWS Cognito](#-configuración-de-aws-cognito)
- [Configuración del Proyecto](#-configuración-del-proyecto)
- [Flujo de Autenticación](#-flujo-de-autenticación)
- [Endpoints y Servicios](#-endpoints-y-servicios)
- [Componentes UI](#-componentes-ui)
- [Integración con Backend Flask](#-integración-con-backend-flask)
- [Scripts Disponibles](#-scripts-disponibles)
- [Variables de Entorno](#-variables-de-entorno)
- [Solución de Problemas](#-solución-de-problemas)
- [Despliegue](#-despliegue)

## ✨ Características

- ✅ **Autenticación completa con AWS Cognito**
- ✅ **Multi-Factor Authentication (MFA)** con TOTP
- ✅ **Registro de usuarios** con confirmación por email
- ✅ **Recuperación de contraseña** con código de verificación
- ✅ **Dashboard protegido** con CRUD de usuarios
- ✅ **Diseño responsive y moderno**
- ✅ **Sistema de notificaciones Toast**
- ✅ **TypeScript** para type safety
- ✅ **React Router DOM** para navegación
- ✅ **Protección de rutas** según estado de autenticación

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.x | Framework UI |
| TypeScript | 5.x | Tipado estático |
| AWS Amplify | 6.x | SDK de Cognito |
| React Router DOM | 7.x | Navegación |
| QRCode.react | 4.x | Generación de códigos QR para MFA |
| Vite | 7.x | Build tool y dev server |
| ESLint | 9.x | Linting |

## 📋 Requisitos Previos

- **Node.js** 18 o superior
- **npm** o **yarn**
- **Cuenta de AWS** con Cognito configurado
- **Backend Flask** (opcional, para CRUD de usuarios)

## 📁 Estructura del Proyecto

```
react-cognito-auth/
├── public/
│   └── vite.svg
├── src/
│   ├── main.tsx                 # Punto de entrada y config de Amplify
│   ├── App.tsx                   # Componente principal con rutas
│   ├── App.css                    # Estilos globales
│   ├── index.css                   # Variables CSS y estilos base
│   ├── vite-env.d.ts               # Tipos para Vite
│   └── modules/
│       ├── auth/                    # Módulo de autenticación
│       │   ├── components/           # Componentes reutilizables
│       │   │   ├── AuthCard.tsx     # Card con diseño consistente
│       │   │   ├── AuthCard.css
│       │   │   ├── Toast.tsx        # Sistema de notificaciones
│       │   │   └── Toast.css
│       │   ├── hooks/
│       │   │   └── useAuth.ts       # Hook personalizado para auth
│       │   ├── pages/                # Páginas de autenticación
│       │   │   ├── LoginPage.tsx
│       │   │   ├── LoginPage.css
│       │   │   ├── RegisterPage.tsx
│       │   │   ├── RegisterPage.css
│       │   │   ├── ForgotPasswordPage.tsx
│       │   │   ├── ForgotPasswordPage.css
│       │   │   ├── ResetPasswordPage.tsx
│       │   │   ├── ResetPasswordPage.css
│       │   │   ├── MfaPage.tsx
│       │   │   ├── MfaPage.css
│       │   │   └── MfaSetupPage.tsx
│       │   └── services/
│       │       └── authService.ts   # Servicios de autenticación Amplify
│       ├── dashboard/                # Módulo de dashboard
│       │   ├── pages/
│       │   │   └── DashboardPage.tsx
│       │   └── styles/
│       │       └── DashboardPage.css
│       └── users/                    # Módulo de gestión de usuarios
│           ├── components/
│           │   ├── UserTable.tsx
│           │   └── UserForm.tsx
│           ├── services/
│           │   └── usersService.ts
│           └── styles/
│               ├── UserTable.css
│               └── UserForm.css
├── .env.example                    # Ejemplo de variables de entorno
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd react-cognito-auth
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz (usa `.env.example` como referencia):

```env
# AWS Cognito Configuration
VITE_COGNITO_USER_POOL_ID=us-east-1_tu-user-pool-id
VITE_COGNITO_CLIENT_ID=7mag12aqd3rkab42g5fbd3occi  # Usar el front client

# API Configuration (opcional, para dashboard)
VITE_API_URL=http://localhost:5000/api
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Configuración de AWS Cognito

### **Paso 1: Crear User Pool**
1. Ve a AWS Console → Cognito → Create User Pool
2. Nombre: `ing_82` (o el que prefieras)
3. Configuración recomendada:
   - **MFA**: Optional o Required
   - **MFA methods**: TOTP (Google Authenticator)
   - **Self-service sign-up**: Enabled
   - **Email verification**: Enabled

### **Paso 2: Crear App Clients**
Necesitas **dos** clients:

#### **Front Client** (para React)
```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id us-east-1_tu-pool-id \
  --client-name "front client" \
  --generate-secret \
  --explicit-auth-flows USER_PASSWORD_AUTH
```

#### **Back Client** (para API Flask)
```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id us-east-1_tu-pool-id \
  --client-name "client back" \
  --generate-secret \
  --explicit-auth-flows USER_PASSWORD_AUTH
```

### **Paso 3: Verificar configuración**
```bash
# Listar tus User Pools
aws cognito-idp list-user-pools --max-results 10 --region us-east-1

# Listar los clients de tu User Pool
aws cognito-idp list-user-pool-clients \
  --user-pool-id us-east-1_tu-pool-id \
  --region us-east-1
```

## 🔐 Flujo de Autenticación

### **Diagrama de Flujo**

```
                    ┌─────────────────┐
                    │   / (Login)     │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │  Ingresar       │
                    │  Email/Password │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   AWS Cognito   │
                    │  Autenticación  │
                    └────────┬────────┘
                             ↓
        ┌────────────────────┴────────────────────┐
        ↓                                         ↓
┌─────────────────┐                     ┌─────────────────┐
│   ¿MFA         │                     │   Dashboard     │
│   Habilitado?  │──────No────────────→│   /dashboard    │
└────────┬────────┘                     └─────────────────┘
         ↓ Sí
┌─────────────────┐
│  /mfa/setup     │
│  (Primera vez)  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Escanear QR     │
│ Confirmar Código│
└────────┬────────┘
         ↓
┌─────────────────┐
│   /mfa          │
│  (Siguientes)   │
└────────┬────────┘
         ↓
┌─────────────────┐
│   Dashboard     │
│   /dashboard    │
└─────────────────┘
```

### **Flujo Detallado**

#### **1. Registro de Usuario**
```
Paso 1: Usuario completa formulario en /register
Paso 2: Cognito envía código de verificación al email
Paso 3: Usuario ingresa código en pantalla de confirmación
Paso 4: Cuenta activada → Redirige a login
```

#### **2. Login sin MFA**
```
Paso 1: Usuario ingresa credenciales en /
Paso 2: Cognito valida credenciales
Paso 3: Redirige directamente a /dashboard
```

#### **3. Login con MFA (Primera vez)**
```
Paso 1: Usuario ingresa credenciales en /
Paso 2: Cognito detecta MFA no configurado
Paso 3: Redirige a /mfa/setup
Paso 4: Muestra QR para escanear con Google Authenticator
Paso 5: Usuario ingresa código de 6 dígitos
Paso 6: MFA configurado → Redirige a /dashboard
```

#### **4. Login con MFA (Sesiones posteriores)**
```
Paso 1: Usuario ingresa credenciales en /
Paso 2: Cognito solicita código MFA
Paso 3: Redirige a /mfa
Paso 4: Usuario ingresa código de 6 dígitos
Paso 5: Código válido → Redirige a /dashboard
```

#### **5. Recuperación de Contraseña**
```
Paso 1: Usuario hace clic en "¿Olvidaste tu contraseña?"
Paso 2: Ingresa email en /forgot-password
Paso 3: Cognito envía código al email
Paso 4: Redirige a /reset-password
Paso 5: Ingresa código y nueva contraseña
Paso 6: Contraseña actualizada → Redirige a login
```

## 📚 Endpoints y Servicios

### **AuthService (`modules/auth/services/authService.ts`)**

```typescript
// Login
export const login = async (username: string, password: string)

// Confirmar MFA
export const confirmMfa = async (code: string)

// Obtener token JWT
export const getToken = async ()

// Registro
export const register = async (email: string, password: string, name: string)

// Confirmar registro
export const confirmRegistration = async (email: string, code: string)

// Reenviar código de confirmación
export const resendConfirmationCode = async (email: string)

// Reset de password
export const requestPasswordReset = async (email: string)
export const confirmPasswordReset = async (email: string, code: string, newPassword: string)

// Obtener usuario actual
export const getCurrentUserInfo = async ()

// Logout
export const logout = async ()
```

### **UsersService (`modules/users/services/usersService.ts`)**

```typescript
// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]>

// Obtener usuario por ID
export const getUserById = async (id: string): Promise<User>

// Crear usuario
export const createUser = async (userData: CreateUserRequest): Promise<User>

// Actualizar usuario
export const updateUser = async (id: string, userData: UpdateUserRequest): Promise<User>

// Eliminar usuario
export const deleteUser = async (id: string): Promise<void>

// Cambiar estado
export const toggleUserStatus = async (id: string, status: "ACTIVE" | "INACTIVE"): Promise<User>
```

### **Hook useAuth (`modules/auth/hooks/useAuth.ts`)**

```typescript
const { user, isLoading, isAuthenticated, logout } = useAuth();
```

## 🎨 Componentes UI

### **AuthCard**
Componente reutilizable para todas las páginas de autenticación:

```tsx
<AuthCard
  icon={<ShieldIcon />}
  title="Verificación MFA"
  subtitle="Ingresa el código de tu app de autenticación"
>
  {/* Contenido del formulario */}
</AuthCard>
```

### **Toast**
Sistema de notificaciones:

```tsx
const { showToast } = useToast();

// Tipos: "success" | "error" | "warning" | "info"
showToast("Usuario creado correctamente", "success");
showToast("Error al iniciar sesión", "error");
```

## 🔌 Integración con Backend Flask

### **Configuración CORS en Flask**
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
```

### **Ejemplo de Llamada a la API**
```typescript
import { getToken } from '../auth/services/authService';

const fetchUsers = async () => {
  const token = await getToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

## 📦 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Genera build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint en el proyecto |

## 🔐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_COGNITO_USER_POOL_ID` | ID del User Pool de Cognito | `Tu User Pool de Cognito` |
| `VITE_COGNITO_CLIENT_ID` | ID del Front Client | `Tu VITE_COGNITO_CLIENT_ID` |
| `VITE_API_URL` | URL de la API Flask | `http://localhost:5000/api` |

## 🐛 Solución de Problemas

### **Error: "User pool does not exist"**
```bash
# Verificar que el User Pool ID es correcto
aws cognito-idp list-user-pools --region us-east-1
# Actualizar VITE_COGNITO_USER_POOL_ID en .env
```

### **Error: "NotAuthorizedException"**
```bash
# Verificar que estás usando el Front Client ID
aws cognito-idp list-user-pool-clients --user-pool-id tu-pool-id --region us-east-1
# Usar el client con nombre "front client" en VITE_COGNITO_CLIENT_ID
```

### **Error de CORS**
```python
# En el backend Flask
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
```

### **Error: "getToken is not a function"**
```typescript
// Verificar que authService.ts exporta correctamente
import { getToken } from '../services/authService';
```

### **Error en el código de confirmación**
```typescript
// Asegurar que el código tiene exactamente 6 dígitos
const validateCode = (value: string): boolean => {
  return /^\d{6}$/.test(value);
};
```

## 🚀 Despliegue

### **Construir para producción**
```bash
npm run build
```

### **Variables de entorno en producción**
```env
VITE_COGNITO_USER_POOL_ID=us-east-1_tu-pool-id
VITE_COGNITO_CLIENT_ID=7mag12aqd3rkab42g5fbd3occi
VITE_API_URL=https://tu-api.com/api
```

### **Opciones de despliegue**

#### **Vercel**
```bash
npm install -g vercel
vercel
```

#### **AWS Amplify Hosting**
```bash
amplify init
amplify add hosting
amplify publish
```

## 📊 Diagrama de Componentes

```
App (Routes)
├── / → LoginPage
├── /register → RegisterPage
├── /forgot-password → ForgotPasswordPage
├── /reset-password → ResetPasswordPage
├── /mfa → MfaPage
├── /mfa/setup → MfaSetupPage
└── /dashboard → DashboardPage
    ├── UserTable
    └── UserForm (Modal)
```

## 📝 Notas Importantes

1. **Front Client vs Back Client**: Usa siempre el **Front Client ID** en React, el Back Client es para la API Flask
2. **MFA**: Una vez configurado, Google Authenticator generará códigos cada 30 segundos
3. **Tokens**: Amplify maneja automáticamente el refresh de tokens
4. **Rutas protegidas**: El dashboard requiere autenticación; si no hay sesión, redirige a login

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/NuevaFeature`)
3. Commit cambios (`git commit -m 'Agregar NuevaFeature'`)
4. Push a la rama (`git push origin feature/NuevaFeature`)
5. Abrir Pull Request


## 👥 Autores

- **Samuel Garduño** - *Trabajo inicial*

## 🙏 Agradecimientos

- AWS Amplify Team
- React Community
- Google Authenticator
- Richi

---

**¿Necesitas ayuda?** Revisa la [documentación de AWS Amplify](https://docs.amplify.aws/) o abre un issue en el repositorio.
