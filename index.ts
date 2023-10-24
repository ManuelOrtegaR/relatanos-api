import http from 'http';

import { config } from './app/config.ts';
import { app } from './app/index.ts';

const { port } = config;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
