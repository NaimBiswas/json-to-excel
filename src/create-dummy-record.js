const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs

function generateRandomJsonRecord() {
  const firstNames = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  const cities = ["New York", "London", "Tokyo", "Paris", "Dhaka", "Mumbai", "Beijing", "Sydney", "Berlin", "Toronto"];
  const countries = ["USA", "UK", "Japan", "France", "Bangladesh", "India", "China", "Australia", "Germany", "Canada"];
  const domains = ["gmail.com", "yahoo.com", "example.com"];
  const streetNames = ["Main St", "Oak Ave", "Pine Ln", "Maple Dr", "Park Pl"];
  const interests = ["reading", "sports", "music", "movies", "travel", "coding", "cooking", "gaming", "photography", "art"];


  const record = {
    id: uuidv4(),
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    age: Math.floor(Math.random() * 48) + 18, // Age between 18 and 65
    city: cities[Math.floor(Math.random() * cities.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    email: `${Math.random().toString(36).substring(2, 10)}@${domains[Math.floor(Math.random() * domains.length)]}`,
    phone: `+${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    is_active: Math.random() < 0.5, // Random boolean
    subscription_level: ["basic", "premium", "gold"][Math.floor(Math.random() * 3)],
    interests: interests.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 6) + 2), // 2 to 7 random interests
    address: {
      street: `${Math.floor(Math.random() * 100) + 1} ${streetNames[Math.floor(Math.random() * streetNames.length)]}`,
      zipcode: `${Math.floor(Math.random() * 90000) + 10000}`,
    },
    created_at: new Date(new Date(2020, 0, 1).getTime() + Math.random() * (new Date(2024, 0, 1).getTime() - new Date(2020, 0, 1).getTime())).toISOString().slice(0, 10), //Random Date
  };
  return record;
}


function createJsonFile(filename, numRecords) {
  const stream = fs.createWriteStream(filename);

  stream.write("[\n"); // Start JSON array

  for (let i = 0; i < numRecords; i++) {
    const record = generateRandomJsonRecord();
    stream.write(JSON.stringify(record));
    if (i < numRecords - 1) {
      stream.write(",\n"); // Add comma unless it's the last record
    } else {
      stream.write("\n");
    }
  }

  stream.write("]\n"); // Close JSON array
  stream.end();

  stream.on('finish', () => {
    console.log(`Generated ${numRecords} JSON records and saved to ${filename}`);
  });

  stream.on('error', (err) => {
    console.error('Error writing to file:', err);
  });
}

const filename = "random_data.json";
const numRecords = 1000000; // 1 million records

createJsonFile(filename, numRecords);