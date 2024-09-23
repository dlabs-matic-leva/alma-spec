// Helper function to generate random full names
function getRandomName() {
    const firstNames = ["John", "Jane", "Alice", "Bob", "Charlie", "David", "Emily", "Fiona", "George", "Hannah"];
    const lastNames = ["Smith", "Johnson", "Brown", "Williams", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Taylor"];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

// Helper function to generate random account balances
function getRandomBalance() {
    return (Math.random() * 1000).toFixed(2); // Random balance between 0 and 10000
}

// Generate an array of 100 random persons
let persons = Array.from({ length: 100 }, () => ({
    fullName: getRandomName(),
    accountBalance: getRandomBalance(),
    status: "active" // Default status to active
}));

// Shuffle the persons array to randomize their positions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// Assign statuses: 10 blocked, 20 pending, and the rest active
// for (let i = 0; i < 10; i++) {
//     persons[i].status = "blocked";
// }
for (let i = 10; i < 30; i++) {
    persons[i].status = "pending";
}

persons = shuffleArray(persons);
// The rest remain "active"

// Display the persons array
console.log(persons);
