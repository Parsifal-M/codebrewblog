---
title: Weeklies(?) - Week 26
date: "2023-06-26T13:03:57Z"
description: "An Update!"
---

Hi everyone 👋!

So doing weeklies is proving to be quite difficult for me to commit to. I think as of now I will do it on a best effort basis. I will try and do it every week but if I miss a week or two I won't beat myself up about it. I think I will just do it when I feel like I have something to say or something to share.

## Melting in the Heat ☀️

The past week or so has been so hot it really does make you just want to sit around and do nothing. We did however, buy a paddleboard and took it down to our local canal here in Haarlem and went for a paddle. It was so nice to be out on the water and it was a great way to cool down. I think we will be doing that a lot more over the summer.

## Doing more with OPA 🧠

I love trying to find new ways to use OPA and this time around I am using it to validate entity metadata in Backstage. When an entity loads, it will send its metadata to the OPA server and the OPA server will validate it against a set of rules. At the moment it will display a card with the results of the validation, i.e. if you are using the wrong system name it will display an error inside the card with "System name must be lowercase" or something like that. I'm toying around with the idea of if there is 1 error then you get a FAIL card, if there are 2 or more warnings it will also FAIL and if there are no errors or less than 2 warnings then it will PASS.

Its been really fun to hack around with and I am learning a lot about OPA and Backstage in the process.

## Using JEST for testing 🧪

I've learned so much about JEST over the past few weeks out of absolute nessesity. Since its the recommended way to test things in Backstage and we have an 80% test coverage requirement I have been writing a lot of tests and learning a lot about JEST in the process. I will say, testing is HARD and I have a lot of respect for people who write tests for a living, its not easy.

It does make me wonder if TDD (Test Driven Development) is the way to go. I have been trying to write tests after I have written the code and I have found it to be a lot easier than trying to write the tests first. I think I will stick to this approach for now and see how it goes.

## Diablo 4 🎮

Me and my wife have been playing Diablo 4 couch co-op and have been loving it, its a nice way to spend some time together and chill and just not have to think about anything other than slaying hordes of demons. 

If you play Diablo 4 let me know!

## Key Takeaways from the week 🤔

- Heat is bad for productivity. -1 Productivity
- Hacking on stuff is fun. +1 Fun, +1 Knowledge
- Testing is hard. -1 Sanity
- Diablo 4 is fun and helps me unwind. +1 Fun