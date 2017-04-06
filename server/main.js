import express from 'express';
import articles from './routes/articles';

const app = express();
const port = 9090;

app.use('/', express.static(__dirname + '/../dist'));

app.get('/hello', (req, res) => {
  return res.send('Can you hear me?');
});

app.use('/articles', articles);

const server = app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});
