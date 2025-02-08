

express = require('express');
cors = require('cors');
routes = require('./routes');
require('dotenv').config();

app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
