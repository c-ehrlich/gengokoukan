# App

## AI
- [ ] make it consistently respect en/jp choice
- [ ] make it use SRS words and increase their interval if used
    - (probably just switch the statements around)
- [ ] the recommendation prompts seem broken (it plays the other role sometimes)
- [ ] make it figure out when to pass time and move to the next stage of situation (eg waiter is done taking order, comes back with food)
- [ ] add markdown documents (for example restaurant menu)
- [ ] write prompts for more situations
- [ ] write prompts in all japanese
- [ ] get summaries working (gpt3.5)
- [ ] Read this - https://community.openai.com/t/how-can-i-maintain-conversation-continuity-with-chat-gpt-api/574819/3
- [ ] Do some comparisons on https://chat.lmsys.org/
- [ ] it shouldn't correct me if i literally copy paste the suggested message
- [ ] better situation creation: "i would like to xyz", it creates a refined prompt from that
- [ ] get it to insert the italki referral link occasionally? https://www.italki.com/de/i/ref/A6aaADc?hl=de&utm_medium=user_referral&utm_source=copylink_share

## Infra
- [ ] translation https://locize.com/blog/next-app-dir-i18n/
- [ ] google login
- [ ] check if responses (corrections) are in the right language (>50% of characters A-Za-z?), translate with gpt-3.5 if wrong, log

## Frontend
- [ ] i18n / language toggle
- [ ] Profile page (and give it to the LLM)
- [ ] Preferences page
    - [ ] UI language
    - [ ] Tutor language
- [ ] make us and japan flag icons in app theme
- [ ] make landing page good enough
- [ ] Fix hydration errors

## Distant future
- [ ] not just conversations, but also stories
    - get last 100 things that happened
    - gpt-3.5 summarizes 11-100 into 1-2 paragraphs, and 1-10 into 1-2 paragraphs
- [ ] get daily feedback - one item to focus on
- [ ] in addition to your level, say which grammar topics you want to see - te form, sareru/saseru/raresaseru, keigo, whatever
- [ ] Refer to BunPro, HelloTalk, WaniKani

## Social
- [ ] Get Hailey to test it
- [ ] start a meme page of funny conversations
- [ ] Write people who are working on similar ideas
    - [ ] https://x.com/moinbukh/status/1729555655776759851 https://x.com/NayanKad/status/1805259624892768462
    - [ ] https://discord.com/channels/901618801324478485/925314442131021824/1243197465562189994 / https://www.youtube.com/watch?v=UjX4Peh4xqM / https://www.linkedin.com/in/william-westerlund-aa2997b9/details/experience/

## **DONE**
- [x] Refactor backend file structure
- [x] setup otel
    - [x] start tracking token usage (to axiom)
    - [ ] finish instrumenting db and openai
    - [ ] wrap entire openai prompt + parsing etc, log failures
- [x] "give me a hint" - ask ai to give you advice on what a good conversation pattern is for this situation
    - [x] ui
    - [x] prompt
    - [x] fix type errors
    - [x] persist to db, and include in chat permanently