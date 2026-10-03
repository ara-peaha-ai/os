---
title: "AI"
description: 
entityLink: "entities/eas"
entity: "Verein/EAS"
badge: ["R&D", "MIT/Prop"]
---

- Memoria basada en Git, self-hosted o en GitHub: Markdown, impulsada por IA e indexada con graphify, con acceso compartido granular.
- Orquestamos modelos comerciales y self-hosted mediante MCP y API.

<!--more-->

**Memoria.** El conocimiento de la empresa vive en un repositorio Git, self-hosted o en GitHub, en Markdown. Cada cambio es un commit: quién cambió qué, cuándo y por qué.

**Índice.** graphify construye el grafo de los nodos de conocimiento del repositorio, así cada tarea parte solo de la información que necesita.

**Acceso compartido granular.** Lo público y lo privado se separan por nombre de archivo, por mercado y por audiencia: se comparte solo lo que se decide compartir.

**Orquestación.** Un router liviano elige el prompt, toma del grafo solo la información y los archivos necesarios y envía el paquete al modelo que hace el trabajo, comercial o self-hosted, mediante MCP o API. El resultado vuelve al router.

**Exposición mínima.** Después de cada llamada se borra la memoria de sesión del modelo comercial y cada llamada lleva una sola tarea aislada: ninguna conversación contiene el panorama completo de la empresa. Las llamadas igual pasan por una misma cuenta de API y pueden quedar registradas; repartir el trabajo entre varios proveedores y modelos locales limita cuánto ve cada uno.

**Decisiones del router.** Hoy en Vercel AI SDK, pasan a Laya, alternativa open source self-hosted a Jev de TypeSafe AI: responde preguntas tipadas con respuestas estructuradas y repetibles, en lugar de escribir texto.
