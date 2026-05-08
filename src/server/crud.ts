import express from 'express';
import { db } from './db.js';
import { v4 as uuidv4 } from 'uuid'; // we need to install uuid if we use it, or just rely on the frontend ID.

const router = express.Router();

router.get('/:table', (req, res) => {
  const { table } = req.params;
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    res.json(rows.map(r => {
      if (r.data) {
        return { id: r.id, ...JSON.parse(r.data) };
      }
      return r;
    }));
  } catch (e: any) {
    if (e.message.includes('no such table')) {
       // if we are doing generic, just return empty array if table doesn't exist
       res.json([]);
    } else {
       res.status(500).json({ error: e.message });
    }
  }
});

router.post('/:table', (req, res) => {
  const { table } = req.params;
  const data = req.body;
  // Let the frontend supply ID or we generate
  const id = data.id || Date.now().toString() + Math.floor(Math.random()*1000);
  data.id = id;

  try {
    // Create table if not exists with a generic JSON column structure
    db.exec(`CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY, data TEXT)`);
    
    // Check if ID exists
    const existing = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(id);
    if (existing) {
       // update instead
       const { id: _, ...rest } = data;
       db.prepare(`UPDATE ${table} SET data = ? WHERE id = ?`).run(JSON.stringify(rest), id);
    } else {
       const { id: _, ...rest } = data;
       db.prepare(`INSERT INTO ${table} (id, data) VALUES (?, ?)`).run(id, JSON.stringify(rest));
    }
    res.json({ success: true, id, data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:table/:id', (req, res) => {
  const { table, id } = req.params;
  const data = req.body;
  try {
    db.exec(`CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY, data TEXT)`);
    const { id: _, ...rest } = data;
    db.prepare(`UPDATE ${table} SET data = ? WHERE id = ?`).run(JSON.stringify(rest), id);
    res.json({ success: true, id, data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:table/:id', (req, res) => {
  const { table, id } = req.params;
  try {
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    res.json({ success: true });
  } catch (e: any) {
    if (e.message.includes('no such table')) {
       res.json({ success: true }); 
    } else {
       res.status(500).json({ error: e.message });
    }
  }
});

export default router;
