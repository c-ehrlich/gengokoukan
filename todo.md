# App

## URGENT
...nothing for now :)

## Frontend

- [ ] fix chat height

## Backend

- [ ] Paginate chat messages

## AI

- [ ] make it use SRS words and increase their interval if used
  - (probably just switch the statements around)
- [ ] I'm basically building character AI... research how they do things.
- [ ] make it consistently respect en/jp choice
- [ ] make it figure out when to pass time and move to the next stage of situation (eg waiter is done taking order, comes back with food)
- [ ] add markdown documents (for example restaurant menu)
- [ ] write prompts for more situations
- [ ] write prompts in all japanese
- [ ] get summaries working (gpt4o mini)
- [ ] Read this - https://community.openai.com/t/how-can-i-maintain-conversation-continuity-with-chat-gpt-api/574819/3
- [ ] Do some comparisons on https://chat.lmsys.org/
- [ ] it shouldn't correct me if i literally copy paste the suggested message
- [ ] better situation creation: "i would like to xyz", it creates a refined prompt from that
- [ ] get it to insert the italki referral link occasionally? https://www.italki.com/de/i/ref/A6aaADc?hl=de&utm_medium=user_referral&utm_source=copylink_share
- [ ] TTS with TacoTron 2 or similar? https://medium.com/axinc-ai/tacotron-2-a-high-quality-speech-synthesis-model-using-ai-for-waveform-conversion-05d39aba88dc

## Infra

- [ ] google login

## Social

- [ ] Get Hailey to test it
- [ ] start a meme page of funny conversations
- [ ] Write people who are working on similar ideas
  - [ ] https://x.com/moinbukh/status/1729555655776759851 https://x.com/NayanKad/status/1805259624892768462
  - [ ] https://discord.com/channels/901618801324478485/925314442131021824/1243197465562189994 / https://www.youtube.com/watch?v=UjX4Peh4xqM / https://www.linkedin.com/in/william-westerlund-aa2997b9/details/experience/

## Distant future

- [ ] check if responses (corrections) are in the right language (>50% of characters A-Za-z?), translate with gpt-4o mini if wrong, log
- [ ] translation https://locize.com/blog/next-app-dir-i18n/
- [ ] Preferences page
  - [ ] UI language
  - [ ] Tutor language
- [ ] make US and Japan flag icons in app theme
- [ ] i18n / UI language toggle
- [ ] not just conversations, but also stories
  - get last 100 things that happened
  - gpt-4o-mini summarizes 11-100 into 1-2 paragraphs, and 1-10 into 1-2 paragraphs
- [ ] get daily feedback - one item to focus on
- [ ] in addition to your level, say which grammar topics you want to see - te form, sareru/saseru/raresaseru, keigo, whatever
- [ ] Grammar RAG
- [ ] Refer to BunPro, HelloTalk, WaniKani

## **DONE**

- [x] fix the worst buttons
  - [x] transparent-ish
  - [x] pill
- [x] Fix voice input
- [x] last100messages seems to return messages in incorrect order + include hints etc
- [x] fix hint firing on enter
- [x] Fix tooltips
- [x] Profile page
  - [x] Create profile
  - [x] Edit profile
  - [x] Give profile to LLM
- [x] Fix hydration errors
- [x] Move ChatPartner into Chat
- [x] fix voice input
- [x] fix crash on chat creation
- [x] the recommendation prompts seem broken (it plays the other role sometimes)
- [x] repair hints
- [x] make landing page good enough
- [x] Refactor backend file structure
- [x] setup otel
  - [x] start tracking token usage (to axiom)
  - [x] finish instrumenting db and openai
  - [x] wrap entire openai prompt + parsing etc, log failures
- [x] "give me a hint" - ask ai to give you advice on what a good conversation pattern is for this situation
  - [x] ui
  - [x] prompt
  - [x] fix type errors
  - [x] persist to db, and include in chat permanently
