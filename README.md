![Axon Architecture](./architecture.png)
##  Getting started locally

# Clone the repo
git clone https://github.com/daljeet2001/Axon.git

# Install dependencies
- cd primary-backend
- cd hook
- cd processor
- cd worker
- cd frontend

npm install

# Start Kafka and PostgreSQL (locally or via Docker)

# Run backend services
npm run dev


.env for worker and all others just have database_url in their .env


---

## 🔐 Environment Variables

```env
# Solana
SOL_PRIVATE_KEY=

# Brevo SMTP
BREVO_SERVER=smtp-relay.brevo.com
BREVO_LOGIN=contact@yourdomain.com
BREVO_API_KEY=xkeysib-...

# Database_url
DATABASE_URL=your_postgres_database_url

