---
title: Troubleshooting & FAQ — AI Commerce Store
---
## Troubleshooting & FAQ

## Common Issues

### API Not Responding

1. Check Docker containers: `docker ps`
2. View API logs: `docker-compose logs api`
3. Ensure ports 1092 (API) and 2100 (DB) are open

### Frontend Not Loading

1. Run `npm install` in `web-frontend/`
2. Start with `npm run dev`
3. Check browser console for errors

### Database Connection Errors

- Verify `DATABASE_URL` in `docker-compose.yml`
- Ensure MySQL container is running

## FAQ

**Q: How do I add a new model?**
A: Use the admin API route: `POST /catalog/models` with required fields.

**Q: How do I compare prices?**
A: Use `/pricing/range` and `/pricing/similar` endpoints or the Pricing page.

**Q: Where do I report bugs?**
A: Open a GitHub issue and tag the relevant team.

---
For more help, see [Setup Guide](../SETUP.md) or contact support.
