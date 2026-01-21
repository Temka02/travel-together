  const express = require('express');
  const cors = require('cors');
  const dotenv = require('dotenv');
  const connectDB = require('./config/database');

  dotenv.config();
  connectDB();

  const app = express();

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());

  // Подключаем Swagger
  require('./src/swagger')(app);

  const authAccess = require('./src/middleware/authAccess');

  // В роутах теперь используем authAccess вместо auth
  app.use('/api/auth', require('./src/routes/auth'));
  app.use('/api/trips', authAccess, require('./src/routes/trips'));
  app.use('/api/applications', authAccess, require('./src/routes/application'));

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });