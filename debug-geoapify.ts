import * as fs from 'fs';

const GEOAPIFY_API_KEY = "c60a1ad62b0e42f3b4f97eed11f1c339";

async function checkGeoapify() {
    const businesses = ["Halifax Middlesbrough", "Ramsdens Middlesbrough"];
    const results = [];

    for (const text of businesses) {
        const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;
        console.log(`Checking: ${text}`);

        const res = await fetch(url);
        const data = await res.json();

        if (data.features && data.features.length > 0) {
            results.push({
                query: text,
                properties: data.features[0].properties
            });
        }
    }

    fs.writeFileSync('debug_results.json', JSON.stringify(results, null, 2));
    console.log("Written to debug_results.json");
}

checkGeoapify();
