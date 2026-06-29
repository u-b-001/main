import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:123@localhost:5432/mosai_fresh'
});

async function run() {
  await client.connect();
  console.log("Connected to DB");
  try {
    await client.query('ALTER TABLE "_pages_v_blocks_steps" DROP COLUMN IF EXISTS "description" CASCADE;');
    await client.query('ALTER TABLE "pages_blocks_steps" DROP COLUMN IF EXISTS "description" CASCADE;');
    await client.query('ALTER TABLE "_pages_v_blocks_steps_steps" DROP COLUMN IF EXISTS "description" CASCADE;');
    await client.query('ALTER TABLE "pages_blocks_steps_steps" DROP COLUMN IF EXISTS "description" CASCADE;');
    console.log("Columns dropped successfully");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
