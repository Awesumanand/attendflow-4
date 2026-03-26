// backend/server.js
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const db   = require('./db');
const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api — health check
app.get('/api', (req, res) => {
  res.json({ message: 'AttendFlow API is running!', version: '1.0' });
});

// GET /api/employees — all employees from DB
app.get('/api/employees', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM employees ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/employees/:id — single employee
app.get('/api/employees/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM employees WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/employees — add new employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    const result = await db.query(
      'INSERT INTO employees (name, email, role, department) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, role, department]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/attendance — today's attendance
app.get('/api/attendance', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, e.name, e.role, e.department
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      ORDER BY a.punch_in DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dashboard — summary stats
app.get('/api/dashboard', async (req, res) => {
  try {
    const total   = await db.query('SELECT COUNT(*) FROM employees');
    const present = await db.query(
      "SELECT COUNT(*) FROM attendance WHERE date = CURRENT_DATE AND status = 'present'"
    );
    const leaves  = await db.query(
      "SELECT COUNT(*) FROM leaves WHERE status = 'pending'"
    );
    res.json({
      success: true,
      data: {
        total_staff:    parseInt(total.rows[0].count),
        present_today:  parseInt(present.rows[0].count),
        pending_leaves: parseInt(leaves.rows[0].count),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`AttendFlow server running at http://localhost:${PORT}`);
});