-- backend/init.sql

CREATE TABLE IF NOT EXISTS employees (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE,
  role       VARCHAR(50),
  department VARCHAR(50),
  status     VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id          SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id),
  punch_in    TIMESTAMP,
  punch_out   TIMESTAMP,
  date        DATE DEFAULT CURRENT_DATE,
  status      VARCHAR(20) DEFAULT 'present'
);

CREATE TABLE IF NOT EXISTS leaves (
  id          SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id),
  leave_type  VARCHAR(50),
  start_date  DATE,
  end_date    DATE,
  reason      TEXT,
  status      VARCHAR(20) DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(50) UNIQUE NOT NULL,
  password    VARCHAR(200) NOT NULL,
  role        VARCHAR(20) DEFAULT 'employee',
  employee_id INT REFERENCES employees(id),
  created_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO employees (name, email, role, department, status) VALUES
  ('Kunal Kumar', 'kunal@attendflow.com', 'Developer', 'Engineering', 'active'),
  ('SS',          'ss@attendflow.com',    'Designer',  'Design',      'active'),
  ('Awa Ad',      'awa@attendflow.com',   'HR',        'HR',          'active'),
  ('Anand Kumar', 'anand@attendflow.com', 'Manager',   'Management',  'active')
ON CONFLICT (email) DO NOTHING;