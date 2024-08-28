const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

// Conversion rates and formulas
const conversionRates = {
    length: {
        meters: {
            meters: 1,
            kilometers: 0.001,
            miles: 0.000621371,
            feet: 3.28084,
            inches: 39.3701
        },
        kilometers: {
            meters: 1000,
            kilometers: 1,
            miles: 0.621371,
            feet: 3280.84,
            inches: 39370.1
        },
        miles: {
            meters: 1609.34,
            kilometers: 1.60934,
            miles: 1,
            feet: 5280,
            inches: 63360
        },
        // Additional length units...
    },
    weight: {
        grams: {
            grams: 1,
            kilograms: 0.001,
            pounds: 0.00220462,
            ounces: 0.035274
        },
        kilograms: {
            grams: 1000,
            kilograms: 1,
            pounds: 2.20462,
            ounces: 35.274
        },
        pounds: {
            grams: 453.592,
            kilograms: 0.453592,
            pounds: 1,
            ounces: 16
        },
        ounces: {
            grams: 28.3495,
            kilograms: 0.0283495,
            pounds: 0.0625,
            ounces: 1
        },
        // Additional weight units...
    },
    temperature: {
        celsius: {
            celsius: (c) => c,
            fahrenheit: (c) => (c * 9 / 5) + 32,
            kelvin: (c) => c + 273.15
        },
        fahrenheit: {
            celsius: (f) => (f - 32) * 5 / 9,
            fahrenheit: (f) => f,
            kelvin: (f) => (f - 32) * 5 / 9 + 273.15
        },
        kelvin: {
            celsius: (k) => k - 273.15,
            fahrenheit: (k) => (k - 273.15) * 9 / 5 + 32,
            kelvin: (k) => k
        },
        // Additional temperature units...
    },
    // Additional categories like volume, speed, etc...
};

// Route to handle conversion requests
app.post('/convert', (req, res) => {
    const { category, inputValue, inputUnit, outputUnit } = req.body;

    try {
        if (category === 'temperature') {
            // Temperature conversion requires function calls
            const convertFn = conversionRates[category][inputUnit][outputUnit];
            if (!convertFn) {
                return res.status(400).json({ error: 'Invalid conversion units' });
            }
            const convertedValue = convertFn(inputValue);
            res.json({ convertedValue });
        } else {
            // Other conversions use multiplication with conversion rates
            const rate = conversionRates[category][inputUnit][outputUnit];
            if (!rate) {
                return res.status(400).json({ error: 'Invalid conversion units' });
            }
            const convertedValue = inputValue * rate;
            res.json({ convertedValue });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
