# InnoLead - Lead Generatie Automatisering

Web applicatie voor Innostock om automatisch e-commerce leads te vinden en te analyseren via n8n workflows.

## Installatie

```bash
cd innolead
npm install
```

## Configuratie

Maak een `.env.local` bestand aan (of pas het bestaande aan):

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxx
APP_PASSWORD=jouw-wachtwoord
NEXT_PUBLIC_APP_URL=https://innolead.nl
```

## Ontwikkeling

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

**Standaard wachtwoord:** `innolead2026` (wijzig dit in `.env.local`)

## Productie

```bash
npm run build
npm start
```

## Functionaliteiten

- **Homepage**: Zoekwoord invoeren en n8n automatisering starten
- **Resultaten pagina**: Alle gevonden bedrijven bekijken met:
  - **Overzicht**: Score, bedrijfsinfo, logistiek, social media
  - **Product Informatie**: Kleinste/grootste/lichtste/zwaarste producten
  - **Reviews**: Google Reviews en TrustPilot beoordelingen
  - **Advertenties**: Meta Ads en Google Ads gegevens
  - **Prospect**: Contactpersonen via Snov.io
- **CSV Download**: Resultaten downloaden als CSV-bestand
- **Wachtwoordbeveiliging**: Eenvoudige toegangscontrole

## n8n Integratie

### Workflow starten
De app stuurt een POST naar je n8n webhook met:
```json
{
  "keyword": "zoekwoord",
  "runId": "uuid",
  "callbackUrl": "https://innolead.nl/api/results/callback"
}
```

### Resultaten ontvangen
n8n stuurt resultaten terug via POST naar `/api/results/callback`:
```json
{
  "runId": "uuid",
  "data": [{ ...lead data... }]
}
```

Of als CSV string:
```json
{
  "runId": "uuid",
  "csvData": "Score %,Company name,..."
}
```

## Deployment op Vercel

1. Push naar een Git repository
2. Importeer het project in [Vercel](https://vercel.com)
3. Stel de environment variables in
4. Koppel het domein `innolead.nl`

## Technologie

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PapaParse (CSV parsing)
