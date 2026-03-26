// backend/server.js

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware — runs on every request
app.use(cors());
app.use(express.json());

// ── TEMPORARY DATA (we replace this with DB later) ──
const employees = [
  { id:1, name:'Kunal Kumar',  role:'Developer',  dept:'Engineering', status:'present' },
  { id:2, name:'SS',           role:'Designer',   dept:'Design',      status:'present' },
  { id:3, name:'Awa Ad',       role:'HR',         dept:'HR',          status:'present' },
  { id:4, name:'Anand Kumar',  role:'Manager',    dept:'Management',  status:'absent'  },
];

const attendance = [
  { id:1, employee_id:1, name:'Kunal Kumar',  punch_in:'12:12 am', punch_out:'12:16 am', hours:'1h 51m', status:'late'    },
  { id:2, employee_id:2, name:'SS',           punch_in:'02:57 pm', punch_out:'11:37 pm', hours:'0h 2m',  status:'present' },
  { id:3, employee_id:3, name:'Awa Ad',       punch_in:'02:57 pm', punch_out:'03:00 pm', hours:'0h 2m',  status:'present' },
  { id:4, employee_id:4, name:'Anand Kumar',  punch_in:'02:57 pm', punch_out:null,       hours:'0h 7m',  status:'present' },
];

// ── API ROUTES ──

// GET /api — health check
app.get('/api', (req, res) => {
  res.json({ message: 'AttendFlow API is running!', version: '1.0' });
});

// GET /api/employees — return all employees
app.get('/api/employees', (req, res) => {
  res.json({ success: true, data: employees });
});

// GET /api/employees/:id — return one employee
app.get('/api/employees/:id', (req, res) => {
  const emp = employees.find(e => e.id === parseInt(req.params.id));
  if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
  res.json({ success: true, data: emp });
});

// GET /api/attendance — return today's attendance log
app.get('/api/attendance', (req, res) => {
  res.json({ success: true, data: attendance });
});

// GET /api/dashboard — return dashboard stats
app.get('/api/dashboard', (req, res) => {
  const present = employees.filter(e => e.status === 'present').length;
  const absent  = employees.filter(e => e.status === 'absent').length;
  res.json({
    success: true,
    data: {
      total_staff:    employees.length,
      present_today:  present,
      absent_today:   absent,
      on_leave:       1,
      late_arrivals:  3,
      pending_leaves: 0,
    }
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`AttendFlow server running at http://localhost:${PORT}`);
  console.log(`Test it: http://localhost:${PORT}/api`);
});