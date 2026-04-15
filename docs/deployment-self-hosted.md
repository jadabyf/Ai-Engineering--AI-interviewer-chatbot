# Self-Hosted Deployment

This project now includes a production Docker setup for self-hosting with HTTPS.

## What was added

- Multi-stage production image: [Dockerfile](../Dockerfile)
- Production compose stack with app + Caddy: [docker-compose.prod.yml](../docker-compose.prod.yml)
- HTTPS reverse-proxy config: [deploy/Caddyfile](../deploy/Caddyfile)
- Environment template for domain and TLS email: [deploy/.env.example](../deploy/.env.example)

## Prerequisites

1. A Linux server with Docker Engine and Docker Compose plugin installed.
2. A DNS A record pointing your domain to the server public IP.
3. Ports 80 and 443 open.

## Deploy

1. From the repository root, create deployment env file:

```bash
cp deploy/.env.example deploy/.env
```

1. Edit `deploy/.env` and set your real values:

```env
DOMAIN=interview.example.com
EMAIL=ops@example.com
```

1. Start the production stack:

```bash
docker compose --env-file deploy/.env -f docker-compose.prod.yml up -d --build
```

1. Check status and logs:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app
```

## Update / Redeploy

```bash
git pull origin main
docker compose --env-file deploy/.env -f docker-compose.prod.yml up -d --build
```

## Rollback (simple)

1. Checkout previous commit:

```bash
git checkout <previous-commit-sha>
```

1. Rebuild and restart:

```bash
docker compose --env-file deploy/.env -f docker-compose.prod.yml up -d --build
```

## Notes

- The app is served by Next.js standalone server on container port 3000.
- Caddy handles HTTPS automatically using ACME.
- `https://<DOMAIN>/health` is wired by Caddy and returns `200`.
