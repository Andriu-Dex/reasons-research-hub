# Proyecto: **REASONS Research Hub**

# 1. Descripción general del sistema

**REASONS Research Hub** es una plataforma web dinámica orientada a la gestión y visualización de información académica e investigativa. El sistema está diseñado para adaptarse a distintos grupos de investigación, laboratorios, centros académicos o instituciones educativas mediante un panel administrativo completamente configurable.

La plataforma permitirá administrar contenido relacionado con investigadores, proyectos, publicaciones científicas, noticias, líneas de investigación y medios de contacto, manteniendo una estructura flexible, reutilizable y escalable.

Aunque el sistema será implementado inicialmente para el grupo de investigación **REASONS** de la Universidad Técnica de Ambato, toda la información institucional, identidad visual y contenido será completamente dinámico y configurable desde el panel administrativo.

El proyecto se desarrollará utilizando Angular para el frontend, Node.js con Express para el backend y PostgreSQL como sistema gestor de base de datos, implementando una arquitectura basada en API REST.

---

# 2. Información general del proyecto

| Elemento                   | Valor                                    |
| -------------------------- | ---------------------------------------- |
| Nombre del software        | REASONS Research Hub                     |
| Nombre del repositorio     | reasons-research-hub                     |
| Tipo de sistema            | Plataforma web académica e investigativa |
| Arquitectura               | Frontend + Backend + API REST            |
| Frontend                   | Angular                                  |
| Backend                    | Node.js con Express                      |
| Base de datos              | PostgreSQL                               |
| Almacenamiento de imágenes | API de Imgur                             |
| Seguridad                  | Nivel alto                               |
| Diseño                     | 100% responsive                          |
| Idioma del código          | Inglés                                   |
| Idioma de la interfaz      | Español                                  |

---

# 3. Objetivo general del sistema

Desarrollar una plataforma web dinámica para la administración y publicación de información académica e investigativa, permitiendo gestionar investigadores, líneas de investigación, proyectos, publicaciones científicas, noticias y medios de contacto mediante un panel administrativo seguro y completamente configurable.

---

# 4. Alcance del sistema

El sistema permitirá que diferentes grupos de investigación, laboratorios, centros académicos o instituciones educativas puedan administrar y publicar su información institucional mediante un portal web dinámico.

La plataforma incluirá funcionalidades para gestionar:

* Información institucional.
* Identidad visual.
* Investigadores.
* Líneas de investigación.
* Proyectos de investigación.
* Publicaciones científicas.
* Noticias y eventos.
* Medios de contacto.
* Configuración general del sitio.

Todos los elementos del sistema deberán poder modificarse desde el panel administrativo, incluyendo:

```txt id="g44m0x"
Nombre de la institución
Nombre del grupo
Logo
Descripción
Misión
Visión
Dominio académico
Líneas de investigación
Investigadores
Proyectos
Publicaciones
Noticias
Redes sociales
Correos institucionales
Direcciones
Paleta de colores
Contenido del Home
```

El sistema no estará limitado a una única institución, permitiendo reutilizar la plataforma para diferentes organizaciones académicas o científicas.

---

# 5. Arquitectura general del sistema

La plataforma estará compuesta por:

| Componente                | Descripción                                                  |
| ------------------------- | ------------------------------------------------------------ |
| Frontend                  | Aplicación Angular para la interfaz pública y administrativa |
| Backend                   | API REST desarrollada con Node.js y Express                  |
| Base de datos             | PostgreSQL                                                   |
| Almacenamiento multimedia | Imgur API                                                    |
| Autenticación             | JWT con refresh token seguro                                 |
| Protección antispam       | Cloudflare Turnstile                                         |

---

# 6. Requerimientos funcionales

# RF-01. Gestión de configuración general

El sistema deberá permitir administrar la configuración general del sitio desde el panel administrativo.

La configuración incluirá:

| Campo                    | Descripción                                     |
| ------------------------ | ----------------------------------------------- |
| Nombre de la institución | Nombre visible de la institución                |
| Nombre del grupo         | Nombre del grupo o laboratorio                  |
| Siglas                   | Siglas institucionales                          |
| Descripción general      | Descripción principal                           |
| Logo                     | Imagen principal del sitio                      |
| Dominio académico        | Área o dominio de investigación                 |
| Correo institucional     | Correo principal                                |
| Dirección                | Dirección física                                |
| Redes sociales           | Facebook, LinkedIn, Instagram, WhatsApp u otras |
| Colores principales      | Variables CSS configurables                     |
| Información del footer   | Datos visibles en el pie de página              |

Toda esta información deberá ser dinámica y editable.

---

# RF-02. Gestión del Home

El sistema deberá permitir administrar la página principal del sitio.

El Home deberá incluir:

| Elemento                  | Descripción                          |
| ------------------------- | ------------------------------------ |
| Banner principal          | Imagen, título y subtítulo dinámicos |
| Descripción institucional | Resumen del grupo o institución      |
| Misión                    | Texto dinámico                       |
| Visión                    | Texto dinámico                       |
| Investigadores destacados | Investigadores seleccionados         |
| Proyectos destacados      | Proyectos relevantes                 |
| Últimas publicaciones     | Publicaciones recientes              |
| Últimas noticias          | Noticias recientes                   |
| Botón de contacto         | Acceso rápido a contacto             |
| Footer institucional      | Información general y enlaces        |

Todo el contenido deberá ser administrable desde el panel.

---

# RF-03. Gestión de la página “Nosotros”

El sistema deberá contar con una página institucional llamada **Nosotros**.

La página deberá permitir visualizar:

| Elemento                  | Descripción            |
| ------------------------- | ---------------------- |
| Descripción del grupo     | Información general    |
| Objetivo general          | Objetivo principal     |
| Objetivos específicos     | Lista de objetivos     |
| Dominio académico         | Área de investigación  |
| Líneas de investigación   | Líneas institucionales |
| Información institucional | Datos académicos       |

Toda la información deberá poder editarse desde el panel administrativo.

---

# RF-04. Gestión de líneas de investigación

El sistema deberá permitir crear, editar, eliminar, ocultar y ordenar líneas de investigación.

Cada línea deberá incluir:

| Campo                  | Descripción                  |
| ---------------------- | ---------------------------- |
| Título                 | Nombre de la línea           |
| Descripción            | Explicación de la línea      |
| Icono                  | Icono representativo         |
| Estado                 | Borrador, Publicado u Oculto |
| Orden de visualización | Campo `displayOrder`         |

---

# RF-05. Gestión de investigadores

El sistema deberá permitir administrar investigadores o integrantes del grupo.

Cada investigador deberá incluir:

| Campo                  | Obligatorio |
| ---------------------- | ----------- |
| Nombre completo        | Sí          |
| Cargo o posición       | Sí          |
| Biografía profesional  | Sí          |
| Correo institucional   | Sí          |
| ORCID                  | Opcional    |
| Foto                   | Opcional    |
| Facebook               | Opcional    |
| LinkedIn               | Opcional    |
| Instagram              | Opcional    |
| Telegram               | Opcional    |
| Investigador destacado | Opcional    |
| Estado                 | Sí          |
| Orden de visualización | Sí          |

Los investigadores podrán:

* Ser destacados en el Home.
* Relacionarse con múltiples proyectos.
* Mantener redes sociales opcionales.
* Ocultarse sin eliminarse.

---

# RF-06. Gestión de proyectos de investigación

El sistema deberá permitir administrar proyectos de investigación.

Cada proyecto deberá incluir:

| Campo                  | Obligatorio |
| ---------------------- | ----------- |
| Título                 | Sí          |
| Participantes          | Sí          |
| Descripción            | Sí          |
| Objetivos              | Sí          |
| Resultados             | Opcional    |
| Imagen principal       | Opcional    |
| Estado del proyecto    | Opcional    |
| Proyecto destacado     | Opcional    |
| Estado de publicación  | Sí          |
| Orden de visualización | Sí          |

Los proyectos podrán relacionarse con varios investigadores mediante una tabla intermedia.

---

# RF-07. Gestión de publicaciones científicas

El sistema deberá permitir administrar publicaciones científicas.

Cada publicación deberá incluir:

| Campo                  | Obligatorio |
| ---------------------- | ----------- |
| Título                 | Sí          |
| Autores                | Sí          |
| Resumen                | Sí          |
| Cita                   | Sí          |
| Portada de revista     | Opcional    |
| DOI                    | Opcional    |
| Enlace externo         | Opcional    |
| Proyecto relacionado   | Opcional    |
| Publicación destacada  | Opcional    |
| Estado de publicación  | Sí          |
| Orden de visualización | Sí          |

Las publicaciones podrán:

* Tener múltiples autores.
* Relacionarse opcionalmente con proyectos.
* Destacarse en el Home.

---

# RF-08. Página de Investigación

La página **Investigación** deberá incluir:

```txt id="xj35xk"
Líneas de investigación
Proyectos de investigación
Artículos científicos
```

El contenido deberá mostrarse mediante:

* Cards.
* Secciones destacadas.
* Carruseles moderados.
* Listados dinámicos.
* Filtros cuando sea necesario.

---

# RF-09. Gestión de noticias

El sistema deberá permitir administrar noticias, eventos, congresos, logros, convocatorias y actividades institucionales.

Cada noticia deberá incluir:

| Campo                  | Obligatorio |
| ---------------------- | ----------- |
| Título                 | Sí          |
| Resumen                | Sí          |
| Contenido              | Sí          |
| Imagen principal       | Opcional    |
| Fecha de publicación   | Sí          |
| Proyecto relacionado   | Opcional    |
| Noticia destacada      | Opcional    |
| Estado de publicación  | Sí          |
| Orden de visualización | Sí          |

---

# RF-10. Página de Contacto

El sistema deberá contar con una página de contacto dinámica.

El administrador podrá habilitar o deshabilitar medios de contacto como:

| Medio              | Dinámico |
| ------------------ | -------- |
| Correo electrónico | Sí       |
| WhatsApp           | Sí       |
| Facebook           | Sí       |
| LinkedIn           | Sí       |
| Instagram          | Sí       |
| Dirección física   | Sí       |
| Mapa               | Opcional |

La interfaz deberá mostrar únicamente los medios configurados.

---

# RF-11. Formulario de contacto

El sistema deberá incluir un formulario de contacto público.

Campos obligatorios:

| Campo              |
| ------------------ |
| Nombre             |
| Correo electrónico |
| Asunto             |
| Mensaje            |

El formulario deberá:

* Enviar mensajes mediante SMTP.
* No guardar mensajes en la base de datos.
* Mostrar toast de éxito o error.
* Validar campos obligatorios.
* Validar formato de correo.
* Integrar Cloudflare Turnstile.

---

# RF-12. Gestión de imágenes

El sistema deberá permitir subir imágenes para:

```txt id="6s0v09"
Logo
Investigadores
Proyectos
Publicaciones
Noticias
Banner principal
```

Las imágenes deberán:

| Requerimiento          | Valor            |
| ---------------------- | ---------------- |
| Subida                 | Desde backend    |
| Servicio               | Imgur API        |
| Formatos permitidos    | JPG, PNG, WebP   |
| Tamaño máximo          | 2 MB recomendado |
| Compresión             | Obligatoria      |
| Conversión recomendada | WebP             |
| Validación MIME        | Obligatoria      |

En PostgreSQL solo se almacenará la URL y metadatos.

---

# RF-13. Panel administrativo

El sistema deberá incluir un panel administrativo privado.

Secciones recomendadas:

```txt id="z3dqdr"
Dashboard
Configuración general
Home
Nosotros
Líneas de investigación
Investigadores
Proyectos
Publicaciones
Noticias
Contacto
Perfil administrador
```

El administrador podrá:

| Acción                |
| --------------------- |
| Crear                 |
| Editar                |
| Eliminar              |
| Publicar              |
| Ocultar               |
| Guardar como borrador |
| Ordenar contenido     |
| Buscar registros      |

---

# RF-14. Estados de publicación

Los contenidos administrables deberán manejar los siguientes estados:

| Estado    | Descripción                |
| --------- | -------------------------- |
| Borrador  | No visible públicamente    |
| Publicado | Visible públicamente       |
| Oculto    | Conservado pero no visible |

Estos estados aplicarán para:

```txt id="jlwmjw"
Investigadores
Líneas de investigación
Proyectos
Publicaciones
Noticias
```

---

# RF-15. Orden de visualización

Los módulos dinámicos deberán incluir el campo:

```txt id="ehmuj1"
displayOrder
```

Este campo permitirá controlar el orden de visualización del contenido.

---

# RF-16. Inicio de sesión administrativo

El sistema deberá permitir inicio de sesión únicamente para administradores.

Campos requeridos:

```txt id="y8wz4v"
Correo electrónico
Contraseña
```

No existirá registro público de usuarios.

---

# RF-17. Protección de rutas

Las rutas administrativas deberán protegerse mediante:

| Área     | Protección                  |
| -------- | --------------------------- |
| Frontend | Angular Guards              |
| Backend  | Middleware de autenticación |

Las rutas públicas solo mostrarán contenido publicado.

---

# RF-18. API REST

La plataforma deberá implementar una API REST.

## Rutas públicas sugeridas

```txt id="6vzjlwm"
GET /api/site-settings
GET /api/home
GET /api/research-lines
GET /api/researchers
GET /api/projects
GET /api/publications
GET /api/news
POST /api/contact
```

## Rutas administrativas sugeridas

```txt id="wj3dfn"
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh

POST /api/admin/researchers
PUT /api/admin/researchers/:id
DELETE /api/admin/researchers/:id

POST /api/admin/projects
PUT /api/admin/projects/:id
DELETE /api/admin/projects/:id

POST /api/admin/publications
PUT /api/admin/publications/:id
DELETE /api/admin/publications/:id

POST /api/admin/news
PUT /api/admin/news/:id
DELETE /api/admin/news/:id

POST /api/admin/media/upload
DELETE /api/admin/media/:id
```

---

# 7. Requerimientos no funcionales

# RNF-01. Diseño responsive

El sistema deberá adaptarse correctamente a:

| Dispositivo |
| ----------- |
| Celular     |
| Tablet      |
| Escritorio  |

En dispositivos móviles deberá existir menú tipo hamburguesa.

---

# RNF-02. Compatibilidad con navegadores

El sistema deberá funcionar correctamente en:

```txt id="zujepg"
Google Chrome
Brave
Microsoft Edge
Mozilla Firefox
```

---

# RNF-03. Idioma del código

Todo el código fuente deberá escribirse en inglés.

Esto incluye:

```txt id="bdp2m8"
Variables
Funciones
Clases
Componentes
Servicios
Controladores
Rutas
Migraciones
Archivos
```

---

# RNF-04. Idioma de la interfaz

Toda la interfaz del usuario deberá mostrarse en español.

Esto incluye:

```txt id="ee0njs"
Botones
Menús
Formularios
Toasts
Mensajes
Panel administrativo
```

---

# RNF-05. Estilos del sistema

El sistema deberá usar:

* Estilos encapsulados por componente en Angular.
* Variables CSS globales.
* Diseño personalizado sin Bootstrap, Tailwind ni Angular Material como base principal.

Ejemplo:

```css id="zv72hr"
:root {
  --color-primary: #0f766e;
  --color-secondary: #134e4a;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #1e293b;
}
```

---

# RNF-06. Uso de iconos

El sistema deberá usar iconos visuales en lugar de emojis.

---

# RNF-07. Uso de toast

El sistema deberá usar notificaciones tipo toast para:

```txt id="c1l49u"
Acciones exitosas
Errores
Confirmaciones
Alertas
```

---

# RNF-08. Seguridad

El sistema deberá implementar seguridad de nivel alto.

Medidas mínimas:

| Medida                       |
| ---------------------------- |
| JWT con refresh token seguro |
| Cookie HttpOnly              |
| Cookie Secure                |
| Cookie SameSite              |
| Contraseñas cifradas         |
| Validación frontend/backend  |
| Sanitización                 |
| Rate limiting                |
| Helmet                       |
| CORS controlado              |
| Variables de entorno         |
| Cloudflare Turnstile         |

---

# RNF-09. Rendimiento

El sistema deberá optimizar:

```txt id="gnc1ul"
Carga de imágenes
Consultas SQL
Carga de contenido
Paginación
Compresión multimedia
```

---

# RNF-10. Mantenibilidad

El proyecto deberá mantener una estructura modular y organizada.

Backend recomendado:

```txt id="8fbrc8"
auth
admins
site-settings
research-lines
researchers
projects
publications
news
contact
media
```

---

# 8. Requerimientos de base de datos

La base de datos será PostgreSQL y deberá respetar la tercera forma normal.

## Entidades recomendadas

```txt id="qv32w9"
admins
site_settings
research_lines
researchers
researcher_social_links
projects
project_researchers
publications
publication_authors
news
contact_channels
media_files
refresh_tokens
```

## Relaciones principales

| Relación                   | Tipo                           |
| -------------------------- | ------------------------------ |
| Investigadores ↔ Proyectos | Muchos a muchos                |
| Proyectos ↔ Investigadores | Muchos a muchos                |
| Publicaciones ↔ Proyectos  | Opcional                       |
| Noticias ↔ Proyectos       | Opcional                       |
| Publicaciones ↔ Autores    | Uno a muchos o muchos a muchos |

---

# 9. Autenticación y seguridad

# RA-01. JWT

El sistema deberá usar JWT para autenticación.

# RA-02. Refresh token

El refresh token deberá almacenarse en cookie:

```txt id="lx3v6l"
HttpOnly
Secure
SameSite
```

# RA-03. Renovación de sesión

El sistema deberá permitir renovar sesiones mediante refresh token válido.

# RA-04. Protección administrativa

Las rutas administrativas deberán requerir autenticación.

# RA-05. Cierre de sesión

El refresh token deberá invalidarse al cerrar sesión.

---

# 10. Interfaz del sistema

# Interfaz pública

La interfaz pública deberá ser:

```txt id="8rypbj"
Moderna
Institucional
Limpia
Académica
Profesional
Responsive
```

La interfaz podrá utilizar:

* Cards.
* Secciones destacadas.
* Carruseles moderados.
* Espaciado amplio.
* Iconografía moderna.

---

# Interfaz administrativa

El panel administrativo deberá incluir:

```txt id="ep4ecv"
Sidebar
Topbar
Tablas administrativas
Formularios dinámicos
Carga de imágenes
Búsqueda
Filtros
Toasts
Confirmaciones
```

---

# 11. Criterios de aceptación

| Código | Criterio                                               |
| ------ | ------------------------------------------------------ |
| CA-01  | El Home carga contenido dinámico                       |
| CA-02  | El administrador puede iniciar sesión                  |
| CA-03  | Los visitantes no acceden al panel administrativo      |
| CA-04  | El administrador puede gestionar investigadores        |
| CA-05  | El administrador puede gestionar proyectos             |
| CA-06  | El administrador puede gestionar publicaciones         |
| CA-07  | El administrador puede gestionar noticias              |
| CA-08  | El administrador puede gestionar configuración general |
| CA-09  | Solo se muestra contenido publicado                    |
| CA-10  | El formulario envía mensajes por SMTP                  |
| CA-11  | El formulario integra Cloudflare Turnstile             |
| CA-12  | El sistema muestra toast correctamente                 |
| CA-13  | Las imágenes se suben mediante Imgur                   |
| CA-14  | Las imágenes se comprimen correctamente                |
| CA-15  | El sistema es responsive                               |
| CA-16  | El sistema funciona en Chrome, Brave, Edge y Firefox   |
| CA-17  | El código está escrito en inglés                       |
| CA-18  | La interfaz está en español                            |
| CA-19  | El modelo relacional respeta tercera forma normal      |
| CA-20  | Las rutas administrativas están protegidas             |

---

# 12. Resumen final de decisiones

| Aspecto                | Decisión                               |
| ---------------------- | -------------------------------------- |
| Nombre del software    | REASONS Research Hub                   |
| Repositorio            | reasons-research-hub                   |
| Frontend               | Angular                                |
| Backend                | Node.js + Express                      |
| Base de datos          | PostgreSQL                             |
| Arquitectura           | API REST                               |
| Seguridad              | Alta                                   |
| Autenticación          | JWT + refresh token seguro             |
| Imágenes               | Imgur API                              |
| Compresión de imágenes | Sí                                     |
| Antispam               | Cloudflare Turnstile                   |
| Contacto               | SMTP dinámico                          |
| Diseño                 | 100% responsive                        |
| Estilos                | CSS por componente + variables CSS     |
| Código                 | Inglés                                 |
| Interfaz               | Español                                |
| Visitantes             | Solo visualización                     |
| Administradores        | CRUD completo                          |
| Estados                | Borrador, Publicado, Oculto            |
| Orden dinámico         | `displayOrder`                         |
| Investigación          | Proyectos + artículos científicos      |
| Noticias               | Eventos, congresos, logros y novedades |
| Plataforma             | Dinámica y reutilizable                |
