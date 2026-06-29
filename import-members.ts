import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import fs from 'fs'

// Basic CSV parser to handle quotes
function parseCSV(text: string) {
  const result = [];
  let row = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(current);
        current = '';
      } else if (char === '\n' || char === '\r') {
        if (current || row.length > 0) {
          row.push(current);
          result.push(row);
          row = [];
          current = '';
        }
        if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') {
          i++;
        }
      } else {
        current += char;
      }
    }
  }
  if (current || row.length > 0) {
    row.push(current);
    result.push(row);
  }
  return result;
}

async function run() {
  console.log("Initializing Payload...");
  const payload = await getPayload({ config: configPromise })
  console.log("Reading CSV...");
  const fileContent = fs.readFileSync('c:/Users/Admin/Downloads/mosai_members.csv', 'utf8')
  
  const parsed = parseCSV(fileContent)
  // Shift headers
  parsed.shift()
  
  let count = 0;
  for (const row of parsed) {
    if (!row || row.length < 2) continue; // Skip empty rows
    
    const [name, instituteVisited, city, year, specialisation, fellowship, presentAddress, email] = row;
    
    // Skip if name is missing
    if (!name) continue;
    
    const membershipId = `MOSAI-M-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    try {
      await payload.create({
        collection: 'members',
        data: {
          name: name.trim(),
          membershipId,
          university: instituteVisited?.trim() || undefined,
          city: city?.trim() || undefined,
          year: year?.trim() || undefined,
          specialisation: specialisation?.trim() || undefined,
          fellowship: fellowship?.trim() || undefined,
          presentAddress: presentAddress?.trim() || undefined,
          email: email?.trim() || undefined,
          isPublic: true,
        }
      });
      count++;
      console.log(`Imported [${count}]: ${name}`);
    } catch (e: any) {
      console.error(`Error importing ${name}:`, e.message);
    }
  }
  
  console.log(`Finished importing ${count} members.`);
  process.exit(0);
}

run();
