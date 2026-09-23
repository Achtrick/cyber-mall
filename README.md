This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploying on Vercel

- Uploaded images are stored in **Vercel Blob** (`utils/shared/storage.js`) and served through `/api/images/<file>` as-is, at their original resolution (CDN-cached). There is no server-side resizing.
- PWA manifests (`/manifests/<shop>.webmanifest`) and the custom-domain map used by `middleware.js` (`/api/domains`) are generated from MongoDB; nothing is written to disk.
- Set the env vars listed in `.env.example` in the Vercel project settings. Create a Blob store under Storage and connect it to the project so `BLOB_READ_WRITE_TOKEN` is set.
- Vercel limits request bodies to 4.5 MB, so uploads are capped at 4 MB per request.

### Changing the domain

The public URL is controlled by **one** env var: `NEXT_PUBLIC_SITE_URL` (see `utils/config/site.js`). It feeds meta tags, canonical links, the footer/legal-page links, `sitemap.xml`/`robots.txt`, and the links sent in activation/reset/notification emails (`utils/shared/security.js`'s `getSiteUrl()`).

To switch domains later (e.g. after buying `cyber-mall.tn`):
1. Attach the domain to the Vercel project (Settings -> Domains).
2. Set `NEXT_PUBLIC_SITE_URL=https://cyber-mall.tn` in Project Settings -> Environment Variables.
3. Redeploy.

No code changes needed. Until it's set, everything defaults to `https://cyber-mall.vercel.app`.
