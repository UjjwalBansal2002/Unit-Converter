// const conversionRates = {
//     length: {
//         meters: ['meters', 'kilometers', 'miles', 'feet', 'inches'],
//         kilometers: ['meters', 'kilometers', 'miles', 'feet', 'inches'],
//         miles: ['meters', 'kilometers', 'miles', 'feet', 'inches'],
//         feet: ['meters', 'kilometers', 'miles', 'feet', 'inches'],
//         inches: ['meters', 'kilometers', 'miles', 'feet', 'inches']
//     },
//     weight: {
//         grams: ['grams', 'kilograms', 'pounds', 'ounces'],
//         kilograms: ['grams', 'kilograms', 'pounds', 'ounces'],
//         pounds: ['grams', 'kilograms', 'pounds', 'ounces'],
//         ounces: ['grams', 'kilograms', 'pounds', 'ounces']
//     },
//     temperature: {
//         celsius: ['celsius', 'fahrenheit', 'kelvin'],
//         fahrenheit: ['celsius', 'fahrenheit', 'kelvin'],
//         kelvin: ['celsius', 'fahrenheit', 'kelvin']
//     }
// };

const conversionRates = {
    length: ['meters', 'kilometers', 'miles', 'feet', 'inches'],
    weight: ['grams', 'kilograms', 'pounds', 'ounces'],
    temperature: ['celsius', 'fahrenheit', 'kelvin']
};

// console.log("hello")

function populateUnitSelect(category) {
    const inputUnitSelect = document.getElementById('inputUnit');
    const outputUnitSelect = document.getElementById('outputUnit');

    // Clear existing options
    inputUnitSelect.innerHTML = 'choose';
    outputUnitSelect.innerHTML = 'choose';

    // Populate options for input and output units based on category
    if (category && conversionRates[category]) {
        const units = conversionRates[category];
        for (const unit of units) {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
            inputUnitSelect.appendChild(option);
            const outputOption = option.cloneNode(true);
            outputUnitSelect.appendChild(outputOption);
        }
    }
}

document.getElementById('category').addEventListener('change', function () {
    const selectedCategory = this.value;
    populateUnitSelect(selectedCategory);
});

document.getElementById('converterForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const inputValue = parseFloat(document.getElementById('inputValue').value);
    const inputUnit = document.getElementById('inputUnit').value;
    const outputUnit = document.getElementById('outputUnit').value;

    try {
        const response = await fetch('http://localhost:3000/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: category,
                inputValue: inputValue,
                inputUnit: inputUnit,
                outputUnit: outputUnit
            })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('result').textContent = `Converted Value: ${data.convertedValue}`;
        } else {
            const errorData = await response.json();
            document.getElementById('result').textContent = `Error: ${errorData.error}`;
        }
    } catch (error) {
        document.getElementById('result').textContent = 'Error: Unable to connect to server.';
    }
});

// Initialize with default category
populateUnitSelect(document.getElementById('category').value);