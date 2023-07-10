---
title: Lets fix HTML with JavaScript
date: "2023-07-10T17:30:31Z"
description: "HTMX, say no to complex Javascript frameworks"
---

# What is HTMX?

I think the official [HTMX website](https://htmx.org/) says it best:

> htmx gives you access to AJAX, CSS Transitions, WebSockets and Server Sent Events directly in HTML, using attributes, so you can build modern user interfaces with the simplicity and power of hypertext
> htmx is small (~14k min.gz’d), dependency-free, extendable, IE11 compatible & has reduced code base sizes by 67% when compared with react

By adhering to an architectural guideline known as "Hypermedia as the Engine of Application State", HTMX cleverly augments HTML by introducing new attributes that adeptly handle the complex necessities of today's UIs. This allows you to write your frontend code in HTML and not have to worry about writing any Javascript.

# Using a Javascript Libray to not write Javascript

The funny thing about HTMX is that it is a Javascript libray that allows you to not have to write any Javascript. It does this by using HTML attributes to add functionality to your HTML elements. For example, if you want to make a button that when clicked will make an AJAX request to a server and then replace the contents of a div with the response, you would write the following:

```html
<button hx-get="/pets" hx-target="#my-pets">Click Me</button>
<div id="my-pets"></div>
```

HTMX captures the server's response and asynchronously replaces this element. Alternatively, you can specify a different target element to be replaced on the page. The triggering event, along with various modifiers such as delay and throttle, can be customized to fine-tune the way requests are sent.

Integrating HTMX into your project is straightforward and involves importing it via a script tag in the head of your HTML document. The only additional requirement is a server built in your preferred programming language that can deliver HTML text responses.

You can find more information on this on their awesome documentation site: [https://htmx.org/docs/](https://htmx.org/docs/)

# HTMX in Action

Over the weekend I had a little play around with HTMX and built a simple web-app that will tell you a joke styled in the theme of a 90s website. You can check it out here: [htmx-demo](https://github.com/Parsifal-M/htmx-demo).

As I was experimenting with HTMX I noticed quite a few people tend to go with [Pug](https://pugjs.org/api/getting-started.html) as their templating language of choice, so I decided to also give that a go.

This is my frontend code:

```pug
doctype html
html
  head
    title '90s Joke Machine
    link(rel="stylesheet", type="text/css", href="/styles.css")
    script(src="https://unpkg.com/htmx.org@1.9.2")
  body
    .container
      h1 Hello and welcome to the Joke Machine!
      button.btn.btn-primary(hx-get="/joke", hx-target="#joke", hx-swap="innerHTML") Get Joke
      #joke.joke-container(hx-trigger="load")
      form(hx-post="/joke", hx-target="#marquee-container", hx-swap="outerHTML")
        .input-container
          input(type="text", name="text", required, placeholder="Enter a joke")
          button(type="submit") Submit joke
      .marquee-container.bounce
        marquee(behavior="alternate") Made by Parcifal-M!
    #marquee-container.marquee-container
```

And these are the routes that handle the requests:

```typescript
import express from 'express';
import { PrismaClient } from "@prisma/client";
import path from 'path';
import validator from 'validator';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', (req, res) => {
    console.log('GET /');
    res.render('index');
});

router.get('/joke', async (req, res) => {
    console.log('GET /joke');
    try {
        const allJokes = await prisma.joke.findMany();
        if(allJokes.length === 0) {
            console.log('No jokes in the database');
            res.send('<p>No jokes in the database!</p>');
        } else {
            const randomJoke = allJokes[Math.floor(Math.random() * allJokes.length)];
            console.log('Selected joke:', randomJoke.text);
            res.send(`<p>${randomJoke.text}</p>`);
        }
    } catch (err) {
        console.error('Error while fetching jokes:', err);
        res.status(500).send('<p>Server error</p>');
    }
});

router.post('/joke', async (req, res) => {
    console.log('POST /joke');
    const { text } = req.body;

    if (!text || text.length > 500) {
        return res.status(400).send('<p>Invalid input</p>');
    }

    const sanitizedText = validator.escape(text);

    try {
        const newJoke = await prisma.joke.create({
            data: {
                text: sanitizedText
            }
        });
        console.log('New joke created:', newJoke.text);
        res.send(`<marquee behavior="alternate">Your Joke Has Been Added!</marquee>`);
    } catch (err) {
        console.error('Error while creating new joke:', err);
        res.status(500).send('<p>Server error</p>');
    }
});


export default router;
```

As you can see with the above, essentially, when you click on the "Get Joke" button, HTMX will make a GET request to the `/joke` endpoint and replace the contents of the `#joke` div with the response. When you submit a joke, HTMX will make a POST request to the `/joke` endpoint and replace the contents of the `#marquee-container` div with the response.

We use partial server-side rendering to dynamically generate jokes when pressing the "Get Joke" button. Additionally, after submitting a joke, we again use partial server-side rendering to display a marquee that displays the message "Your Joke Has Been Added!" Moving forward, I'd like to explore more possibilities of SSR and experiment with it.

The jokes are all stored in my postgres database and I use Prisma to interact with it. I also use [validator](https://www.npmjs.com/package/validator) to sanitize the input (just for fun).

# Conclusion

I really like HTMX. It's a great way to build simple web-apps without having to worry about writing any Javascript. I think it's a great tool to have in your toolbox and I'm looking forward to using it in future projects. I don't think it will ever replace Javascript frameworks like React or Vue, but I think it stands on its own as a great alternative for simple web-apps.

Now... what else can I build with HTMX? 🤔