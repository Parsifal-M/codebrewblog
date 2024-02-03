---
title: You can use OPA for Authorization in Backstage!
date: "2024-02-03T12:57:59Z"
description: "Part 1: How to use OPA with Backstage for authorization"
---

Hello everyone! In this post we are going to see how you can use OPA with Backstage for authorization!

## What is OPA?

[OPA](https://www.openpolicyagent.org/) (pronounced “oh-pa”) is an open source, general-purpose policy engine that unifies policy enforcement across the stack. OPA is an open source project that was created by [Styra](https://www.styra.com/) and then donated to the [Cloud Native Computing Foundation](https://www.cncf.io/). It uses the declarative language Rego to define policies, more information on that [here](https://www.openpolicyagent.org/docs/latest/policy-language/).

## What is Backstage?

[Backstage](https://backstage.io/) is an open source framework for creating a developer portal (IDP or Internal Developer Portal). Backstage was created by Spotify and donated to the [Cloud Native Computing Foundation](https://www.cncf.io/) and has gained a lot of traction in the open source community.

## Why use OPA with Backstage?

Backstage uses the [Permissions Framework](https://backstage.io/docs/permissions/overview) to define permissions, this is very useful for defining permissions like RBAC in the portal, the permissions are defined in 'policies' that are written in TypeScript. This in itself is not bad and for most will be fine, but it does have some drawbacks, for example:

- If you don't know TypeScript, you can't define permissions.
- If you have a security team that is responsible for defining permissions, they have to learn TypeScript to be able to define permissions.
- The policies can be difficult to maintain, especially if they are large.
- You need to redeploy the code every time you change the permissions.

## How can OPA help?

OPA can be used to define authorization policies and then use them in Backstage with the plugin [@parsifal-m/plugin-permission-backend-module-opa-wrapper](https://www.npmjs.com/package/@parsifal-m/plugin-permission-backend-module-opa-wrapper). The plugin simply forwards the authorization requests to OPA and OPA responds with an `ALLOW` or `DENY` or `CONDITIONAL` (more on this in part 2!).

This can help simplify the definition of permissions, as the permissions are defined in OPA (in Rego) and not in TypeScript, and you don't need to redeploy the code every time you change the permissions, you just need to update the policies in OPA.

### What benefits does this bring?

- You don't need to know TypeScript to define permissions.
- You don't need to redeploy the code every time you change the permissions, just update the policies in OPA.
- DevSecOps (or security teams) can define the permissions in OPA without needing to know TypeScript, (They do need to know some Rego)
- If you are already using OPA for other applications, its quite a simple setup to use it with Backstage.

## How does it work?

If you take a look at how the official Backstage Permissions Framework works, you can see this [here](https://backstage.io/docs/permissions/overview#how-does-it-work), in step 3, you can see the following:

> The permission framework's backend delegates the authorization decision to the permission policy, which is specified by the integrator using code, a provided authorization method (such as RBAC), or integrations with external authorization providers.

The plugin [@parsifal-m/plugin-permission-backend-module-opa-wrapper](https://www.npmjs.com/package/@parsifal-m/plugin-permission-backend-module-opa-wrapper) simply replaces the 'Permission Policy' with OPA! When a user triggers an action in a plugin, that plugin backend sends a request to the permission framework's backend with the authorization details, the OPA wrapper plugin then forwards this request to OPA, OPA responds with a decision and then the authorization decision is sent to the plugin from the permission backend. In a very high level view, it looks like this:

- Plugin 1: "Hey, Peter is trying to delete a component, can he do that?"
- Permission Backend: "Hey OPA, can Peter delete a component?"
- OPA: "Yes, Peter can delete a component"
- Permission Backend: "Yes, Plugin 1, Peter can delete a component"
- Plugin 1: "Ok, Peter can delete a component"

You can also find some high level design documents here in the Github Repo: [OPA Plugin Design](https://github.com/Parsifal-M/backstage-opa-plugins/tree/main/docs) and of course the [README](https://github.com/Parsifal-M/backstage-opa-plugins?tab=readme-ov-file#welcome-to-the-opa-plugins-repository-for-backstage)

## How easy is it to set up?

It's quite easy to set up, you can find the instructions in the README of the plugin here: [plugin-permission-backend-module-opa-wrapper](https://github.com/Parsifal-M/backstage-opa-plugins/blob/main/plugins/permission-backend-module-opa-wrapper/README.md). If you are on the "new" backend for Backstage its just a simple import.

But instructions for both the "old" and "new" backends are provided in the README.

## Conclusion

The goal of this post was to introduce you to the idea of using OPA with Backstage for authorization. In part 2 we will go through some examples with OPA policies and how you can use them in Backstage, and also go into a bit more detail on what is going on under the hood.