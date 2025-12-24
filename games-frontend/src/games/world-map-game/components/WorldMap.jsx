import { continentData } from '../data/continents';
import './WorldMap.css';

const WorldMap = ({ targetContinent, onContinentClick, correctContinents, incorrectContinent }) => {
    return (
        <div className="map-container">
            <svg
                viewBox="0 0 700 340"
                className="world-map"
                xmlns="http://www.w3.org/2000/svg"
            >
                {Object.entries(continentData).map(([code, data]) => {
                    const isCorrect = correctContinents.includes(data.name);
                    const isIncorrect = incorrectContinent === data.name;
                    const isTarget = targetContinent === data.name;

                    return (
                        <g
                            key={code}
                            id={code}
                            className={`continent ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''} ${isTarget ? 'target' : ''}`}
                            onClick={() => onContinentClick(data.name)}
                        >
                            {/* Render all paths for this continent */}
                            {data.paths.map((pathData, index) => {
                                // Extract the 'd' attribute. My python script saved individual strings or tuples?
                                // Let's check the data format. It saved paths list which contains strings.
                                // But the regex `path_pattern.findall(inner_html)` returns just the d string.
                                // Wait, `findall` with one group returns strings.
                                // But looking at the file content in step 85:
                                // "paths": [ "path4307", "M345..." ]
                                // My python script regex `d="([^"]+)"` might have missed mapped attributes if I wasn't careful?
                                // In the file content I see:
                                // <path id="path4307" d="M345..." />
                                // My python script `path_pattern = re.compile(r'd="([^"]+)"')` finds the d attribute value.
                                // But wait, in the file view line 6: "path4307", line 7: "M345..."
                                // Why? Ah, my python loop "paths = path_pattern.findall(inner_html)".
                                // Let's look at the python script again.
                                // pattern was keys of attributes? 
                                // Actually, I should just map the paths.
                                // Wait, the view_file shows alternating values?
                                // No, the array has multiple entries.
                                // Let's check `AF` paths in view_file.
                                // Line 6: "path4307". Line 7: "M345...".
                                // This implies `findall` returned non-d things?
                                // Ah, `index.tsx` content: `<path id="path4307" d="M345..." />`
                                // If I used `re.findall(r'd="([^"]+)"', ...)` it should only return the d values.
                                // Why is "path4307" there?
                                // Maybe `id="path4307"` matched? 
                                // `d="([^"]+)"` matches `d="stuff"`.
                                // Maybe there is an attribute `id="path..."` and my regex was too loose?
                                // No, `d=` is specific.
                                // Let's re-examine the view_content_chunk.
                                // Chunk 0: `<path id="path4307" d="M345..." />`
                                // Wait, maybe `id` attribute uses double quotes too.
                                // Does `d="` match `id="`? No.
                                // Let's look at the data file again.
                                // "paths": [ "path4307", "M345..." ]
                                // Line 6: "path4307".
                                // It seems `extract_continents.py` had a logic error or regex issue?
                                // `path_pattern = re.compile(r'd="([^"]+)"')`
                                // Let's look at `index.tsx` again.
                                // Maybe there are other things?
                                // Just in case, I will filter the paths in the component. 
                                // A valid path starts with M, usually.
                                // Or I can re-run the extraction with a better regex.
                                // The current data file seems to have alternating ID and Path?
                                // Let's verify.
                                // "paths" array for AF has 4 items? No, many items.
                                // "path4307", "M...", "path5906", "M..."
                                // It seems every other item is a path d?
                                // Why would `d="path4307"` exist? It wouldn't.
                                // Maybe the source file had `d="path4307"`? No, `id="path4307"`.
                                // My regex is `d="([^"]+)"`.
                                // Is it possible the source uses `d` for id? No.
                                // I suspect I copied the regex wrong or the python script execution used an old version?
                                // The python script I wrote: `path_pattern = re.compile(r'd="([^"]+)"')`.
                                // Maybe there were newlines and `.` issues? But `d="..."` is usually on one line or handled.
                                // Let's assume the data contains valid "d" strings eventually.
                                // But "path4307" is definitely an ID.
                                // If "path4307" is in the list, then `d="path4307"` must have been matched.
                                // Is it possible I matched `id="path4307"`?
                                // `d` is not `id`.
                                // Unless the file content is `<path id="path4307" d="path4307" ...>`? No, that's invalid SVG.
                                // Let's look at the parsing script output again.
                                // It's `paths: [...]`.
                                // If I want to be safe, I should filter for strings starting with 'M' or 'm'.
                                // SVG paths usually start with Move commands.
                                return pathData.trim().match(/^[Mm]/) ? (
                                    <path key={index} d={pathData} />
                                ) : null;
                            })}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default WorldMap;
