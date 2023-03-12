---
title: OPA Plugin for Backstage
date: "2023-03-10T08:42:51Z"
description: "How Hard Can It Be?"
---

# Getting Plugged In 🔌

I have been umming and ahing over making an attempt at creating some plugins for [Backstage](https://backstage.io/) on the one hand it would be a really cool thing to do and on the other its kind of terrifying and can get quite complex unless you have an idea of what you are doing.

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

Currently it is not very modular as I am still figuring out how to make it work.

I am still thinking about an adequate way to manage the policies, I do not want one huge file with all the policies in it. I am thinking of having a policies folder that could then divide the policies into different areas. For example, you could have a catalog folder that would contain all the policies for the catalog. This would allow you to have a more modular approach to managing the policies.

This code defines a function called cannotDeleteEntities. This function takes an OpaClient object as an argument, which is used to communicate with an OPA server that contains the policy rules.

The function returns a callback function that takes a PolicyQuery object as an argument and returns a Promise that resolves to a PolicyDecision object. This PolicyQuery object contains information about the permission being requested, such as the permission name and any associated parameters.

The callback function checks if the permission being requested is to delete a catalog entity. If the name is catalog.entity.delete, the function proceeds to evaluate the my-custom-policy policy using the OpaClient object provided as an argument.

The evaluatePolicy method of the OpaClient object is used to evaluate the policy, passing in an input object containing the path property set to catalog.entity.delete. The evaluatePolicy method sends a POST request to the OPA server with the policy name and input data in the request body.

If the request is successful (i.e., the response.ok property is true), the method parses the response body as JSON and returns the result property of the JSON object as a boolean value. If the request fails, the method throws an error with a message indicating the failure status.

The callback function returns a PolicyDecision object with the result property set to either AuthorizeResult.ALLOW or AuthorizeResult.DENY, depending on the result of the policy evaluation. If the policy denies the requested permission, the result property is set to AuthorizeResult.DENY. Otherwise, it is set to AuthorizeResult.ALLOW.

If the requested permission is not to delete a catalog entity, the callback function returns a PolicyDecision object with the result property set to AuthorizeResult.ALLOW. This allows all other permissions by default.

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


The constructor method takes a Config object as an argument, which is used to initialize the baseUrl property of the class. The baseUrl is obtained from the configuration object by calling the config.getString method with the key integrations.opa.baseUrl. This allows you to easily configure the URL of the OPA server by setting the integrations.opa.baseUrl property in your Backstage configuration file.

The evaluatePolicy method is used to evaluate an OPA policy given its name and an input object containing data that will be used by the policy to make a decision. The method sends a POST request to the OPA server with the policy name and input data in the request body, using the node-fetch library.

If the request is successful (i.e., the response.ok property is true), the method parses the response body as JSON and returns the result property of the JSON object as a boolean value. If the request fails (i.e., the response.ok property is false), the method throws an error with a message indicating the failure status.

This OpaClient class can be used to create instances of OPA clients that can be used throughout your Backstage application to evaluate policies and make authorization decisions.

I have tested this code locally and it seems to work as expected... as of now.

## Whats Next 🗺

- I'd like to make it more modular and configurable.
- I'd like to add some tests. 🙃
- Better documentation.
- I'd like to add some more examples of how to use OPA with Backstage.
- Add more policies to the policies.ts file to cover more use cases. (would be cool to have a library of policies that people can use)
- More longterm, I would like it to be possible to view and edit policies in the GUI of Backstage and apply them on the fly.

## Stay Tuned 📺

I will try to make some regular updates on my blog on the development of this plugin. Stay tuned for more updates!

P.S Want to help? Let me know! I'd love to have some help with this project. You can hit me up on my [socials](https://linkfree.eddiehub.io/Parsifal-M) 🙏 