# WohnungWeb
is a Typescript based form filler that utilizes [node-imap](https://github.com/mscdex/node-imap) and [playwright](https://www.npmjs.com/package/playwright) to automatically fill questionnaires for many different Online Forms of German Housing Companies.

Current supported forms are:
- GeWoBag
- DeGeWo

## How to use
<b>IMPORTANT:</b> The Code Assumes that all mails are in a folder called "Wohnung". If you want to change it, change the code accordingly
1. [Make your copy from the template](https://github.com/drblaui/WohnungWeb/generate)
2. Add all information from the `.env` File as [Github Secrets](https://docs.github.com/en/github-ae@latest/rest/actions/secrets) or if you don't care about the information being exposed, you can also just write them directly into the [workflow file](./.github/workflows/check.yml)
3. Thats it. Your new repository should now check your email every 5 Minutes for a new link

> Tip: If you're searching for flats in Berlin, this tool combines perfectly with the [Wohnungsbot](https://wohnungsbot.de/)