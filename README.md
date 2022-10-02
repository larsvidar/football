This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
First of all, create an .env.local file (use _example.env.local_ as a starting-point).
Fill out:
	- APIURL: Url for sending graphql-requests.
	- DEFAULT_TOURNAMENT_ID: Id of tournament to be loaded if no other tournament-id is defined.

To run the development server:

```bash
npm run dev
# or
yarn dev
```

To build the project:

```bash
npm run build
# or
yarn build
```

To start production-server:

```bash
npm start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
