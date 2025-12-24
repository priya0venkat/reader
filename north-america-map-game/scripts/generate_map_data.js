import fs from 'fs';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';
import * as topojsonServer from 'topojson-server';

const geoJsonPath = './scripts/countries.geo.json';
const outputPath = './src/data/countries.js';

// Central American countries (Merged into one)
const centralAmericaCodes = ['GTM', 'BLZ', 'SLV', 'HND', 'NIC', 'CRI', 'PAN'];

// Other North American countries
const otherCountryCodes = [
    'CAN', 'USA', 'MEX',
    'CUB', 'HTI', 'DOM', 'JAM', 'BHS'
];

const geoJson = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'));

// Filter all relevant features
const allCodes = [...centralAmericaCodes, ...otherCountryCodes];
const features = geoJson.features.filter(f => allCodes.includes(f.id));

if (features.length === 0) {
    console.error('No matching countries found!');
    process.exit(1);
}

// Create Topology to allow merging
const topology = topojsonServer.topology({ countries: { type: "FeatureCollection", features: features } });

// Merge Central America
// topojson.merge returns a MultiPolygon geometry
const centralAmericaGeometry = topojson.merge(topology, topology.objects.countries.geometries.filter(g => centralAmericaCodes.includes(g.id)));

// Construct a Feature from the geometry
const centralAmericaFeature = {
    type: "Feature",
    id: "CAM",
    properties: { name: "Central America" },
    geometry: centralAmericaGeometry
};

// Get other countries as individual features
const otherCountriesFeatures = otherCountryCodes.map(code => {
    // Find geometry in topology to ensure consistency, or just grab from original features (simpler since we didn't modify them)
    // But generating from topology helps ensure they fit together if we cleaned it. 
    // However, topojsonServer.topology preserves coordinates by default unless quantized. 
    // Let's simpler fetch from original `features` list to avoid ID lookup complexity if topology drops props.
    // Actually, topology drops properties usually.
    return features.find(f => f.id === code);
});

// Combine for projection fitting
// Note: We need to use the merged geometry for Central America
const finalFeatures = [...otherCountriesFeatures, centralAmericaFeature];

const collection = {
    type: "FeatureCollection",
    features: finalFeatures
};

// Setup projection
const width = 1000;
const height = 800;

const projection = d3.geoMercator()
    .fitSize([width, height], collection);

const pathGenerator = d3.geoPath().projection(projection);

const countriesList = [];
const countriesData = {};

// Helper to generate color
const generateColor = (index) => {
    const goldenAngle = 137.508;
    const hueOffset = (index * goldenAngle) % 240;
    const hue = (180 + hueOffset) % 360;
    const saturation = 60 + ((index * 23) % 36);
    const lightness = 45 + ((index * 17) % 21);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

finalFeatures.forEach((feature, index) => {
    let name = feature.properties.name;
    if (name === 'United States of America') name = 'United States';
    if (name === 'The Bahamas') name = 'Bahamas';

    countriesList.push(name);

    // Check if geometry is valid
    if (!feature.geometry) {
        console.warn(`Missing geometry for ${name}`);
        return;
    }

    countriesData[name] = {
        path: pathGenerator(feature),
        id: feature.id,
        color: generateColor(index)
    };
});

const fileContent = `// North America Countries Data
// Generated from world.geo.json
// Central America merged into single unit

export const countriesList = ${JSON.stringify(countriesList, null, 4)};

export const countriesData = ${JSON.stringify(countriesData, null, 4)};
`;

fs.writeFileSync(outputPath, fileContent);
console.log(`Successfully generated map data for ${countriesList.length} entities at ${outputPath}`);
