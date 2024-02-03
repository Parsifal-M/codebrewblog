---
title: Usando OPA con Backstage para authorization!
date: "2024-01-30T12:55:59Z"
description: "Part 1: Como se puede usar OPA con Backstage para authorization"
---

¡Hola a todos! En este post vamos a ver cómo se puede usar OPA con Backstage para autorización!

## ¿Qué es OPA?

[OPA](https://www.openpolicyagent.org/) es un framework de authorization que se puede usar para definir políticas de authorization y luego usarlas en aplicaciones. OPA es un proyecto open source que fue creado por [Styra](https://www.styra.com/).

## ¿Qué es Backstage?

[Backstage](https://backstage.io/) es un framework open source para crear un portal para desarrolladores (IDP o Internal Developer Portal). Backstage fue creado por Spotify y donado a la [Cloud Native Computing Foundation](https://www.cncf.io/).

## ¿Por qué usar OPA con Backstage?

Backstage usa el 'Permissions Framework' para definir permisos, esto es muy util para definir permisos como RBAC en el portal.

Lost permisos se definen en 'policies' que son escritas en TypeScript. Esto como es no tiene nada de malo, pero un problema que tiene es que los permisos están en el código, y en algunos casos esto pude ser difícil de mantener.

¿Y si tienes un equipo de seguridad que se encarga de definir los permisos? ¿Ellos tienen que aprender TypeScript para poder definir los permisos? No es muy práctico.

Entonces, toda la responsabilidad de definir los permisos recae en los desarrolladores, y eso no es muy ideal.

Y es aquí donde entra OPA. OPA se puede usar para definir las políticas de authorization y luego usarlas en Backstage con el plugin [@parsifal-m/plugin-permission-backend-module-opa-wrapper](https://www.npmjs.com/package/@parsifal-m/plugin-permission-backend-module-opa-wrapper) el plugin simplemente envía las peticiones de authorization a OPA y OPA responde con un `ALLOW` o `DENY` o `CONDITIONAL` (mas sobre esto mas adelante).

Esto simplifica mucho la definición de permisos, ya que los permisos se definen en OPA y no en TypeScript, además no hace falta desplegar el código cada vez que se cambian los permisos. (¡yay!)