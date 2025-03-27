const mongoose = require('mongoose');
const express = require('express');
const app = express();

// ...existing code...

mongoose.connect('your-mongodb-connection-string', {
  // Remove deprecated options
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// ...existing code...

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
