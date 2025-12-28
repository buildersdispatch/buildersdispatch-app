# BuildersDispatch App

This repository contains the active application source code for **BuildersDispatch**.

## Purpose
BuildersDispatch is a scalable platform for dispatching construction services, products, and warranties using modern web infrastructure and Web3 payment rails.

This repository is the **authoritative source** for:
- Backend APIs
- Frontend (React / Vite)
- Crossmint integration
- Business logic

## Structure


## Deployment Model
- `frontend_src/` is built using Vite
- Build output is deployed separately (not committed)
- Secrets are managed via `.env` files (never committed)

## Canonical Baseline
This repository includes a **known-good Crossmint Hosted Checkout implementation**.

If Crossmint integration ever breaks, return to the tagged baseline commit:


## VPS Rebuild
Infrastructure and VPS setup are intentionally kept in a **separate repository**:


---

© BuildersDispatch
