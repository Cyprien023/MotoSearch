import 'dotenv/config';
import { createApp } from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = createApp();

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`http://localhost:${PORT} (DATA_SOURCE=${process.env.DATA_SOURCE ?? 'mock'})`);
});