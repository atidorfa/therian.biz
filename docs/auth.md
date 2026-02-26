# Autenticación

El sistema usa **NextAuth.js v4** con `CredentialsProvider` y sesiones JWT. No hay OAuth en el MVP.

**Archivos relevantes:**
- `lib/auth.ts` — configuración de NextAuth
- `lib/session.ts` — helper `getSession()`
- `app/api/auth/register/route.ts` — registro de usuario
- `app/api/auth/verify/route.ts` — verificación de email
- `app/api/auth/[...nextauth]/route.ts` — handler de NextAuth
- `app/login/page.tsx` — página de login

---

## Flujo de registro

```
1. Usuario envía email + contraseña
2. POST /api/auth/register
   a. Validar con Zod (email, min 8 chars password)
   b. Verificar email no existe → 409 si duplicado
   c. bcrypt.hash(password, 12) → User creado con emailVerified: null
   d. Generar VerificationToken (uuid, expira en 24h)
   e. Enviar email con enlace /api/auth/verify?token=<token>
3. Usuario hace clic en el enlace
4. GET /api/auth/verify?token=<token>
   a. Buscar token en DB, verificar no expirado
   b. Actualizar User.emailVerified = now()
   c. Eliminar VerificationToken
   d. Redirect a /login?verified=true
```

---

## Flujo de login

```
1. NextAuth CredentialsProvider.authorize()
2. Buscar User por email
3. bcrypt.compare(password, user.password)
4. Verificar user.emailVerified !== null → lanza 'EMAIL_NOT_VERIFIED'
5. Devolver { id, email, name }
6. NextAuth crea JWT con userId embebido
7. El JWT se almacena en cookie httpOnly
```

---

## Configuración NextAuth

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email:    { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        // 1. Buscar usuario
        // 2. Comparar contraseña con bcrypt
        // 3. Verificar emailVerified
        // 4. Retornar { id, email, name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id
      return token
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

---

## Helper de sesión

```typescript
// lib/session.ts
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export async function getSession() {
  return getServerSession(authOptions)
}
```

Se usa en todos los Server Components y API Routes protegidos:

```typescript
const session = await getSession()
if (!session?.user?.id) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
```

---

## Variables de entorno requeridas

```env
NEXTAUTH_SECRET="secreto-jwt-cambiar-en-prod"
NEXTAUTH_URL="http://localhost:3000"
```

`NEXTAUTH_SECRET` se usa para firmar los JWTs. Debe tener al menos 32 caracteres en producción.

---

## Email de verificación

El sistema envía emails usando Nodemailer / Resend (configurar en `.env.local`):

```env
# Resend
RESEND_API_KEY="re_..."

# O Nodemailer SMTP
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="noreply@therian.biz"
SMTP_PASS="password"
```

El enlace de verificación tiene la forma:
```
https://therian.biz/api/auth/verify?token=<uuid>
```

Los tokens expiran en **24 horas**.

---

## Redirecciones

| Ruta | Comportamiento sin sesión |
|------|--------------------------|
| `/therian` | Redirect a `/login` |
| `/pvp` | Redirect a `/login` |
| `/adopt` | Redirect a `/login` |
| `/casa` | Redirect a `/login` |
| `/` (root) | Redirect a `/login` o `/therian` |

La raíz (`app/page.tsx`) detecta la sesión del servidor y redirige automáticamente.

---

## TypeScript — Extensión de tipos

NextAuth requiere extender los tipos para incluir `userId`:

```typescript
// types/next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
  }
}
```
