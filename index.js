const express = require('express');
const app = express();
const PORT = process.env.PORT || 9090;
const authRoutes = require('./Routes/auth.routes');
const employeesRoutes = require('./Routes/employees.routes');
const financesRoutes = require('./Routes/finances.routes');
const departmentsRoutes = require('./Routes/departments.routes');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
})

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/finances', financesRoutes);
app.use('/api/departments', departmentsRoutes);


app.listen(PORT, ()=> console.log(`Server work on port: ${PORT}`))