import 'dotenv/config';
import app from '../api/index.js';

// For local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
