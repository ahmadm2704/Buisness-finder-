
const GOOGLE_API_KEY = "AIzaSyA-VOF1IyeayUYYZOnw0CEAZ4oOcQ6b8yk";

async function checkBusiness() {
    if (!GOOGLE_API_KEY) {
        console.error("No API KEY found in process.env");
        return;
    }

    const query = "Crescent Grill Chambers St New York";
    console.log(`Searching for: ${query}`);

    // Step 1: Find ID
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
        console.log("Business NOT FOUND in Text Search.");
        return;
    }

    const place = data.results[0];
    console.log(`FOUND Candidate: ${place.name} (${place.place_id})`);
    console.log(`Address: ${place.formatted_address}`);

    // Step 2: Get Details (Website check)
    const fields = 'name,website,url,formatted_phone_number';
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=${fields}&key=${GOOGLE_API_KEY}`;

    const res2 = await fetch(detailsUrl);
    const data2 = await res2.json();
    const details = data2.result;

    console.log("\n--- DETAILS ---");
    console.log(`Name: ${details.name}`);
    console.log(`Website Field: ${details.website ? details.website : "[UNDEFINED - THIS IS A MATCH]"}`);
    console.log(`Maps URL: ${details.url}`);

    if (!details.website) {
        console.log("\n✅ CONCLUSION: This business SHOULD be found by the scanner.");
    } else {
        console.log("\n❌ CONCLUSION: This business has a 'website' field, so it is correctly FILTERED OUT.");
        console.log(`Value: ${details.website}`);
    }
}

checkBusiness();
