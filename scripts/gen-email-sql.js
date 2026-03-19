const fs = require('fs');
const Papa = require('papaparse');
const csv = fs.readFileSync('sample-data.csv.csv', 'utf8');
const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
const rows = parsed.data;

const emailCols = [
  ['Contact 1 Email URL', 'contact_1_email_url'],
  ['Contact 1 Email', 'contact_1_email'],
  ['Contact 2 Email URL', 'contact_2_email_url'],
  ['Contact 2 Email', 'contact_2_email'],
  ['Contact 3 Email URL', 'contact_3_email_url'],
  ['Contact 3 Email', 'contact_3_email'],
  ['Contact 4 Email URL', 'contact_4_email_url'],
  ['Contact 4 Email', 'contact_4_email'],
  ['Contact 5 Email URL', 'contact_5_email_url'],
  ['Contact 5 Email', 'contact_5_email'],
];

const esc = (s) => s.replace(/'/g, "''");

const statements = [];
for (const row of rows) {
  const name = (row['Company name'] || '').trim();
  if (!name) continue;
  const sets = [];
  for (const [csvCol, dbCol] of emailCols) {
    const val = (row[csvCol] || '').trim();
    if (val) {
      sets.push(`${dbCol} = '${esc(val)}'`);
    }
  }
  if (sets.length > 0) {
    statements.push(`UPDATE leads SET ${sets.join(', ')} WHERE company_name = '${esc(name)}';`);
  }
}

const output = statements.length > 0
  ? `-- Update email columns for ${statements.length} companies\n${statements.join('\n')}\n`
  : '-- No rows have email data to update\n';

fs.writeFileSync('supabase/update-email-data.sql', output);
console.log(`Written ${statements.length} UPDATE statements to supabase/update-email-data.sql`);
