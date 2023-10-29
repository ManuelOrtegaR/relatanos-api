import http from 'http';

import { config } from './app/config.ts';
import { app } from './app/index.ts';
import { connect } from './app/database.ts';

const { port } = config;

// Connect to database
connect();

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
