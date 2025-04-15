require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')))
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/build')))
}
console.log(path.join(__dirname, '../client/build'));

app.get('/', (req, res) => {
  res.send('Auction API is running');
});

//heroku
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//local
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));