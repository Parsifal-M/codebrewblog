---
title: OPA Plugin for Backstage
date: "2023-03-16T17:01:26Z"
description: "How Hard Can It Be?"
---

# Getting Plugged In 🔌

I have been umming and ahing over making an attempt at creating some plugins for [Backstage](https://backstage.io/) on the one hand it would be a really cool thing to do and on the other its kind of terrifying and can get quite complex unless you have an idea of what you are doing. Be warned! From here on out things get a little experimental!

## The Idea 💡

It's probably no surprise to anyone that knows me that I am a fan of [OPA](https://www.openpolicyagent.org/) and I have been playing around with it for a while now. Although I don't get to use it to the extent that I'd like to, I always try and squeeze it in where I can. So obviously I thought it would be a good idea to create a plugin for Backstage that would allow you to use OPA to control some authorization (kind-of-RBAC) to your Backstage instance.

In essence, the plugin would act as a wrapper around the Backstage permission system and allow you to use OPA to control and make auth descisions to the Backstage instance. This would allow you to use OPA to control and make auth descisions to Backstage based on the user's identity, group membership, or any other data that you can get from the identity provider.

## The Problem 🤔

The problem is that I don't have much experience with Backstage plugins, I am fairly comfortable with React and TypeScript but I have never created a plugin before. I have contributed to a few of the Backstage plugins but I have never created one from scratch. So I thought I would document my journey and hopefully help someone else who is in a similar position.

## The Plan 📝

All the below is subject to change as I learn more about Backstage plugins and how they work.

I did not want to completely rehaul the Backstage permission system, I wanted to create a plugin that would act as a wrapper around the existing permission system. This would allow me to use OPA to control authorization descisions in Backstage without having to change the existing permission system. Which I think for now is a good approach.

My initial creation is a `policies.ts` file that looks a little like this:

```typescript
import { PolicyDecision } from '@backstage/plugin-permission-common';
import { PolicyQuery } from '@backstage/plugin-permission-node';
import { OpaClient } from '../opa-client/opaClient';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

export async function cannotDeleteEntities(opaClient: OpaClient) {
  return async (request: PolicyQuery): Promise<PolicyDecision> => {
    // Check if the requested action is to remove a catalog entity
    if (request.permission.name === 'catalog.entity.delete') {
      const result = await opaClient.evaluatePolicy('my-custom-policy', {
        input: {
          permission: {
            path: 'catalog.entity.delete',
          },
        },
      });

      return { result: result ? AuthorizeResult.DENY : AuthorizeResult.ALLOW };
    }

    // Return ALLOW for all other permissions
    return { result: AuthorizeResult.ALLOW };
  };
}
```

In the above code snippet, we have a function called cannotDeleteEntities that helps control user permissions. 

Specifically, it prevents users from deleting catalog entities. The function takes an OpaClient object as an argument, which is used to interact with the policy rules stored on an OPA server.

The function returns a callback that accepts a PolicyQuery object and produces a PolicyDecision object. If the requested permission is to delete a catalog entity, the function evaluates the 'my-custom-policy' policy using the evaluatePolicy method of the OpaClient. Based on the evaluation result, the function returns a PolicyDecision object with either an AuthorizeResult.DENY or AuthorizeResult.ALLOW result.

In this case, for any other permissions, the callback function returns a PolicyDecision object with an AuthorizeResult.ALLOW result by default, allowing all other actions. (This is just for testing purposes, in a real-world scenario, you might want to have a bit more control over what permissions are allowed and what are not.)

The `opaClient.ts` file looks a little like this:

```typescript
import { Config } from '@backstage/config';
import fetch from 'node-fetch';

export class OpaClient {
  private readonly baseUrl: string;

  constructor(config: Config) {
    this.baseUrl = config.getString('integrations.opa.baseUrl');
  }

  async evaluatePolicy(policy: string, input: any): Promise<boolean> {
    const response = await fetch(${this.baseUrl}/v1/data/${policy}, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(Failed to evaluate policy, status=${response.status});
    }

    const data = await response.json();
    return data.result as boolean;
  }
}
```


The above defines an OpaClient class used to interact with an OPA server for the policy evaluation.

The evaluatePolicy method accepts a policy name and input data. It then sends a POST request to the OPA server to evaluate the specified policy. If the evaluation is successful, it returns the result as a boolean value.

I think this is a good start, but I am sure there is a lot of room for improvement, currently we still need to add this to the Backstage permission system, which I will cover in the next post.

## Whats Next 🗺

The next challange is to integrate this into the Backstage permission system (in a `permission.ts` file). I have been playing around with this and had some promising results, but I am not yet ready to share them. I will update this post when I have something more polished to show!

- I'd like to make it more modular and configurable.
- I'd like to add some tests. 🙃
- Make sure it works reliably.
- Better documentation.
- I'd like to add some more examples of how to use OPA with Backstage.
- Add more policies to the policies.ts file to cover more use cases. (would be cool to have a library of policies that people can use)
- More longterm, I would like it to be possible to view and edit policies in the GUI of Backstage and apply them on the fly.

## Stay Tuned 📺

I will try to make some regular updates on my blog on the development of this plugin. Stay tuned for more updates!

P.S Want to help? Let me know! I'd love to have some help with this project. You can hit me up on my [socials](https://linkfree.eddiehub.io/Parsifal-M) 🙏 