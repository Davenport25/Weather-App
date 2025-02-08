

express = require('express');
axios = require('axios');
dotenv = require('dotenv');
knex = require('./database');

dotenv.config();
router = express.Router();
API_KEY = process.env.OPENWEATHER_API_KEY;

//  Fetch Weather Data
router.get('/weather', async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: { q: city, appid: API_KEY, units: 'metric' }
        });

        // Save search history (assuming userId = 1 for testing)
        await knex('search_history').insert({ userId: 1, city });

        res.json({
            city: response.data.name,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity
        });

    } catch (error) {
        res.status(500).json({ error: "Error fetching weather data" });
    }
});

//  Get Search History
router.get('/history', async (req, res) => {
    const userId = 1; // Hardcoded user for now
    try {
        const history = await knex('search_history').where({ userId }).select('*');
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Error fetching search history" });
    }
});

//  Delete a Search History Entry
router.delete('/history/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await knex('search_history').where({ id }).del();
        if (deleted) return res.json({ message: "History entry deleted" });
        res.status(404).json({ error: "Entry not found" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting entry" });
    }
});

module.exports = router;
