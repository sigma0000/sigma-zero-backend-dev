import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT, PGSSL } = process.env;

let dbClient: Client;

const connectToDB = async () => {
  dbClient = new Client({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: Number(PGPORT),
    ssl: PGSSL === 'true',
  });

  await dbClient.connect();
};

export { connectToDB, dbClient };
