---
title: OPA Permissions Wrapper Plugin
date: "2023-08-28T13:03:57Z" # TODO: Update date
description: "A Short Intro to the OPA Permissions Wrapper Plugin"
---

Hi Everyone 👋!

I've been working with [Backstage](https://backstage.io) for a while now and although I've had some issues here and there, mostly due to my own lack of knowledge, I have been really enjoying it. I've been working on a few plugins for Backstage based on OPA and one of them is the [OPA Permissions Wrapper Plugin](https://github.com/Parsifal-M/brewed-backstage/tree/main/plugins/opa-permissions-wrapper).

## What does this do? 🤔

I think when Spotify was building Backstage internally (before they open sourced it) I don't think they ever really needed to enforce permissions on the frontend. They have a lot of trust in their engineers and I think that is a great thing. However, not all companies have mature enough engineering teams to be able to trust them to not do something weird. And I think this is why the [Permissions Framework](https://backstage.io/docs/permissions/overview/) came into play.

The Permissions Framework is a great way to enforce permissions on the frontend and it works really well. However, it does require you to write code to create "policies" and "permissions" and then re-deploy your Backstage instance anytime those permissions or policies change, which in most cases is probably fine but still a bit of a pain.

This is where the OPA Permissions Wrapper Plugin comes in. It allows you to write your policies and permissions in `.rego` files and then deploy them to an OPA server. The OPA Permissions Wrapper Plugin will then query the OPA server for the permissions and policies descision and send that back to the permissions framework to enforce them. This means that you can change your policies and permissions without having to re-deploy your Backstage instance and gives you the full power of OPA to write your policies and permissions.

## The Permissions Framework 📜

I won't regurgitate the [Permissions Framework](https://backstage.io/docs/permissions/overview/) documentation here but I will give a quick overview of how it works.

The Permissions Framework accepts 3 types of desisions:
- `AuthorizeResult.ALLOW` - This is an unconditional allow, it will always allow the user to do the action.
- `AuthorizeResult.DENY` - This is an unconditional deny, it will always deny the user from doing the action.
- `AuthorizeResult.CONDITIONAL` - This is a conditional allow, it will allow the user to do the action if the conditions are met.

With the above in mind, you can write your policies and permissions to return one of the above decisions and the Permissions Framework will enforce them. Let's take a look at an example from the documentation:

```ts
class TestPermissionPolicy implements PermissionPolicy {
  async handle(request: PolicyQuery): Promise<PolicyDecision> {
    if (request.permission.name === 'catalog.entity.delete') {
      return {
        result: AuthorizeResult.DENY,
      };
    }

    return { result: AuthorizeResult.ALLOW };
  }
}
```

The above satisfies the following requirements:
- If the permission is `catalog.entity.delete` then deny the user from doing the action.
- If the permission is anything else then allow the user to do the action.

There is no conditional descision here, its either allow or deny. Now lets take a quick look at a conditional descision:

```ts
import {
  BackstageIdentityResponse,
  IdentityClient
} from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  PolicyDecision,
  isPermission,
} from '@backstage/plugin-permission-common';
import {
  catalogConditions,
  createCatalogConditionalDecision,
} from '@backstage/plugin-catalog-backend/alpha';
import {
  catalogEntityDeletePermission,
} from '@backstage/plugin-catalog-common/alpha';

class TestPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
   ): Promise<PolicyDecision> {
    if (isPermission(request.permission, catalogEntityDeletePermission)) {
      return createCatalogConditionalDecision(
        request.permission,
        catalogConditions.isEntityOwner({
          claims: user?.identity.ownershipEntityRefs ?? [],
        }),
      );
    }
     return { result: AuthorizeResult.ALLOW };
  }
}
```

The above satisfies the following requirements:
- If the permission is a `catalogEntityDeletePermission` then we want to check if the user is the owner of the entity and if they are then allow them to do the action, if they are not then deny them from doing the action.
- If the permission is anything else then allow the user to do the action.

In the above, if the conditions are met then the user will be allowed to do the action, if the conditions are not met then the user will be denied from doing the action, making this a conditional descision.

So as you can see, the Permissions Framework is quite powerful and allows you to write some pretty complex policies and permissions. However, as I mentioned above, it does require you to write code and re-deploy your Backstage instance anytime you want to change your policies or permissions which may not be what you want to do.

## OPA Permissions Wrapper Plugin 📦

So now, again without going into too much detail as the technical stuff will come in a later post(s), lets take a quick look at how the OPA Permissions Wrapper Plugin works.

We can use the same examples as above but instead of writing code we will write `.rego` files. Let's take a look at the first example:

```rego
package catalog_policy

import future.keywords.if

# Default decisions
default allow := false

# Don't allow deleting catalog entities
allow if {
 not input.permission.name = "catalog.entity.delete"
}
```

The above policy in `.rego` is the same as the first example above. It will deny the user from doing the action if the permission is `catalog.entity.delete` and allow the user to do the action if the permission is anything else.

Now lets take a look at the second example which is a conditional descision and slightly more complex:

```rego
package catalog_policy

import future.keywords.if
import future.keywords.in

# Default decisions
default allow := true

default conditional := false

# Set conditional
conditional if {
	is_delete
}

# condition for deleting
condition := {"allOf": [{
	"resourceType": "catalog-entity",
	"rule": "IS_ENTITY_OWNER",
	"params": {"claims": input.identity.groups},
}]} if {
	is_delete
}

# Helper rule to check if the identity is an avenger
is_delete if {
	input.permission.name == "catalog.entity.delete"
}
```

What we are doing in the above is saying that if the permission is `catalog.entity.delete` then we want to check if the user is the owner of the entity and if they are then allow them to do the action, if they are not then deny them from doing the action. If the permission is anything else then allow the user to do the action.

I have also been experimenting with adding the condition as `data` in the `.rego` file and then using that in the policy. This is what it looks like:

```rego
package catalog_policy

import future.keywords.if
import future.keywords.in

# Default decisions
default allow := true

default conditional := false

# Set conditional
conditional if {
	is_delete
}

# condition for deleting
condition := data.policy_condition_is_delete {
	is_delete
}

# Helper rule to check if the identity is an avenger
is_delete if {
	input.permission.name == "catalog.entity.delete"
}
```

And the data being:

```json
{
  "policy_condition_is_delete": {
    "allOf": [
      {
        "resourceType": "catalog-entity",
        "rule": "IS_ENTITY_OWNER",
        "params": {
          "claims": input.identity.groups
        }
      }
    ]
  }
}
```

I think this is enough for part 1 of this series. In the next part I will go into more detail about how the OPA Permissions Wrapper Plugin works and how you can use it in your Backstage instance if you want to!