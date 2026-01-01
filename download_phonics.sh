#!/bin/bash
# Download phonics audio files with proper headers to bypass hotlink protection

OUTPUT_DIR="phonics_audio_human"
mkdir -p "$OUTPUT_DIR"

REFERER="https://www.showandtellletter.com/alphabet-sounds"
USER_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

declare -A URLS=(
    ["a"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/1-1Aa.mp3"
    ["b"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/2-1Bb.mp3"
    ["c"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/3-1C-c.mp3"
    ["d"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/4-1D-d.mp3"
    ["e"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/5-1Ee.mp3"
    ["f"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/6-1Ff.mp3"
    ["g"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/7-1Gg.mp3"
    ["h"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/8-1Hh.mp3"
    ["i"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/9-1Ii.mp3"
    ["j"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/10-1Jj.mp3"
    ["k"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/11-1Kk.mp3"
    ["l"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/12-1Ll.mp3"
    ["m"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/13-1Mm.mp3"
    ["n"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/14-1Nn.mp3"
    ["o"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/15-1Oo.mp3"
    ["p"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/16-1Pp.mp3"
    ["q"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/17-1Qq.mp3"
    ["r"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/18-1Rr.mp3"
    ["s"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/19-1Ss.mp3"
    ["t"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/20-1Tt.mp3"
    ["u"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/21-1Uu.mp3"
    ["v"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/22-1Vv.mp3"
    ["w"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/23-1Ww.mp3"
    ["x"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/24-1Xx.mp3"
    ["y"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/25-1Yy.mp3"
    ["z"]="https://www.showandtellletter.com/wp-content/uploads/2025/04/26-1Zz.mp3"
)

echo "Downloading phonics audio files with browser headers..."

for letter in {a..z}; do
    url="${URLS[$letter]}"
    output_file="$OUTPUT_DIR/${letter}.mp3"
    echo "Downloading ${letter}.mp3..."
    curl -L -o "$output_file" \
        -H "User-Agent: $USER_AGENT" \
        -H "Referer: $REFERER" \
        -H "Accept: audio/mpeg, audio/*, */*" \
        --silent --show-error \
        "$url"
    
    # Check if file was downloaded successfully
    if [ -s "$output_file" ]; then
        size=$(wc -c < "$output_file")
        echo "  ✓ Saved ${letter}.mp3 ($size bytes)"
    else
        echo "  ✗ Failed to download ${letter}.mp3"
        rm -f "$output_file"
    fi
done

echo ""
echo "Download complete! Checking results..."
ls -la "$OUTPUT_DIR/"
