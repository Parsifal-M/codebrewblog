---
title: Usando OPA con Backstage para authorization!
date: "2024-02-03T12:57:59Z"
description: "Part 1: Como se puede usar OPA con Backstage para authorization"
---

¡Hola a todos! En esta publicación vamos a ver cómo se puede usar OPA con Backstage para la autorización.

## ¿Qué es OPA?

[OPA](https://www.openpolicyagent.org/) es un marco de trabajo para la autorización que se puede usar para definir políticas de autorización y luego usarlas en aplicaciones. OPA es un proyecto de código abierto creado por [Styra](https://www.styra.com/). Utiliza el lenguaje declarativo Rego para definir políticas, puedes encontrar más información aquí: [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/).

## ¿Qué es Backstage?

[Backstage](https://backstage.io/) es un marco de trabajo de código abierto para crear un portal para desarrolladores (IDP o Portal Interno para Desarrolladores). Backstage fue creado por Spotify y donado a la [Cloud Native Computing Foundation](https://www.cncf.io/) y ha ganado mucha tracción en la comunidad de código abierto.

## ¿Por qué usar OPA con Backstage?

Backstage utiliza el [Permissions Framework](https://backstage.io/docs/permissions/overview) para definir permisos, esto es muy útil para definir permisos como RBAC en el portal. Los permisos se definen en 'policies' (políticas) que están escritas en TypeScript. Esto en sí mismo no es malo y para la mayoría estará bien, pero tiene algunas desventajas, por ejemplo:

- Si no conoces TypeScript, no puedes definir permisos.
- Si tienes un equipo de seguridad que es responsable de definir los permisos, tienen que aprender TypeScript para poder definir los permisos.
- Las políticas pueden ser difíciles de mantener, especialmente si son grandes.
- Necesitas volver a desplegar el código cada vez que cambias los permisos.

## ¿Cómo puede ayudar OPA?

OPA se puede usar para definir políticas de autorización y luego usarlas en Backstage con el plugin [@parsifal-m/plugin-permission-backend-module-opa-wrapper](https://www.npmjs.com/package/@parsifal-m/plugin-permission-backend-module-opa-wrapper). El plugin simplemente reenvía las solicitudes de autorización a OPA y OPA responde con un `ALLOW` o `DENY` o `CONDITIONAL` (más sobre esto en la parte 2!)

Esto puede ayudar a simplificar la definición de permisos, ya que los permisos se definen en OPA (en Rego) y no en TypeScript, y no necesitas volver a desplegar el código cada vez que cambias los permisos, solo necesitas actualizar las políticas en OPA.

### ¿Qué beneficios aporta esto?

- No necesitas conocer TypeScript para definir permisos.
- No necesitas volver a desplegar el código cada vez que cambias los permisos, solo actualiza las políticas en OPA.
- DevSecOps (o equipos de seguridad) pueden definir los permisos en OPA sin necesidad de conocer TypeScript, (Sí necesitan conocer algo de Rego)
- Si ya estás usando OPA para otras aplicaciones, es bastante sencillo configurar para usarlo con Backstage.

## ¿Cómo funciona?

Si echas un vistazo a cómo funciona el marco de permisos oficial de Backstage, puedes verlo [aquí](https://backstage.io/docs/permissions/overview#how-does-it-work), en el paso 3, puedes ver lo siguiente:

> El backend del marco de permisos delega la decisión de autorización a la política de permisos, que es especificada por el integrador usando código, un método de autorización proporcionado (como RBAC), o integraciones con proveedores externos de autorización.

El plugin [@parsifal-m/plugin-permission-backend-module-opa-wrapper](https://www.npmjs.com/package/@parsifal-m/plugin-permission-backend-module-opa-wrapper) simplemente reemplaza la 'Política de Permisos' con OPA. Cuando un usuario desencadena una acción en un plugin, ese backend del plugin envía una solicitud al backend del marco de permisos con los detalles de autorización, el plugin de envoltura OPA luego reenvía esta solicitud a OPA, OPA responde con una decisión y luego la decisión de autorización se envía al plugin desde el backend de permisos. En una vista de muy alto nivel, se ve así:

- Plugin 1: "Oye, Peter está intentando eliminar un componente, ¿puede hacerlo?"
- Backend de Permisos: "Oye OPA, ¿puede Peter eliminar un componente?"
- OPA: "Sí, Peter puede eliminar un componente"
- Backend de Permisos: "Sí, Plugin 1, Peter puede eliminar un componente"
- Plugin 1: "Ok, Peter puede eliminar un componente"

También puedes encontrar algunos documentos de diseño de alto nivel aquí en el repositorio de Github: [Diseño del Plugin OPA](https://github.com/Parsifal-M/backstage-opa-plugins/tree/main/docs) y por supuesto el [README](https://github.com/Parsifal-M/backstage-opa-plugins/blob/main/plugins/permission-backend-module-opa-wrapper/README.md)

## ¿Qué tan fácil es de configurar?

Es bastante fácil de configurar, puedes encontrar las instrucciones en el [README](https://github.com/Parsifal-M/backstage-opa-plugins/blob/main/plugins/permission-backend-module-opa-wrapper/README.md). Si estás en el "nuevo" backend para Backstage, es simplemente una importación sencilla.

Pero las instrucciones para ambos backends, el "viejo" y el "nuevo", se proporcionan en el README.

## Conclusión

El objetivo de esta publicación fue presentarte la idea de usar OPA con Backstage para la autorización. En la parte 2, revisaremos algunos ejemplos con políticas de OPA y cómo puedes usarlas en Backstage, y también entraremos en un poco más de detalle sobre lo que está sucediendo bajo el capó.

> NOTA: Los instrucciones para la instalación del plugin aun no están disponibles en Español, pero esta en mi lista de tareas pendientes. Si tienes alguna pregunta, no dudes en contactarme en el Discord de Backstage!