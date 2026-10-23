const fs = require('fs');

const init = JSON.parse(fs.readFileSync('data/01_initial.json', 'utf8'));
const upd = JSON.parse(fs.readFileSync('data/02_update.json', 'utf8'));

console.log('=== CALLS METADATA ===');
const calls = init.records.filter(r => r.source_type === 'call');
calls.forEach(c => {
  const p = c.payload;
  console.log(`${c.record_ref} | rep: ${p.rep_name?.padEnd(6)} | dur: ${String(p.duration_seconds).padStart(3)}s | talk: ${String(p.talk_time_seconds).padStart(3)}s | conn: ${String(p.is_connected).padEnd(5)} | conv: ${String(p.is_conversation).padEnd(5)} | outcome: ${String(p.observed_outcome).padEnd(20)} | first_dial: ${p.first_dial_ever} | first_conn: ${p.first_connect_ever} | prior_dials: ${p.prior_dials_ever} | prior_conn: ${p.prior_connects_ever}`);
});

console.log('\n=== MEETINGS METADATA ===');
const meetings = init.records.filter(r => r.source_type === 'meeting');
meetings.forEach(m => {
  const p = m.payload;
  const turnsCount = m.transcript_payload?.turns?.length || 0;
  console.log(`${m.record_ref} | org: ${p.organizer_email} | rec_status: ${p.recording_status?.padEnd(14)} | has_tx: ${String(p.has_transcript).padEnd(5)} | turns: ${turnsCount} | unavail_reason: ${m.transcript_payload?.unavailable_reason || 'none'}`);
});
