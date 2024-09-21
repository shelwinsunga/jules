# Jules: AI LaTeX Editor

[Jules](https://juleseditor.com) is a proof of concept AI-Latex Editor. You select a range, type into the dialogue, and the LLM will (hopefully) create a diff that turns your natural language request into compileable LaTeX.  

https://github.com/user-attachments/assets/b5587351-7ff4-40be-9ba1-bffdbbb71b39


It has basic LaTeX project management features, like adding/deleting files and folders, images, svgs, etc. `main.tex` is required to compile.

Note this is a `proof-of-concept` and not a "production" application. There will be bugs, important missing features, and UX issues that make it not quite ready yet for daily usage.

## Local Setup

To get Jules working locally, you need:
- An Anthropic Key
- An App ID from [InstantDB](https://www.instantdb.com/)
- A deployed instance of the API on railway (`railway-api`).

Set those in a `.env.local` file.

You can then:

```
git clone git@github.com:shelwinsunga/jules.git
cd jules
npm install i
npm run dev
```

You can run the flask endpoint locally by running:

```
cd railway-api
hypercorn main:app --reload
```

You need pdflatex installed as well as the stuff in requirements.txt


## Acknowledgments

Created by [Shelwin Sunga](https://x.com/shelwin_). Licensed under the [MIT License](https://github.com/shelwinsunga/jules/blob/main/LICENSE)

- Inspired by Cursor and Overleaf

