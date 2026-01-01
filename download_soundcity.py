#!/usr/bin/env python3
"""
Download human-voice phonics audio files from Sound City Reading.
This site has free educational phonics sounds.
"""
import os
import urllib.request

output_dir = "phonics_audio_human"
os.makedirs(output_dir, exist_ok=True)

# Direct URLs from Sound City Reading (human voice recordings)
# Base URL pattern: https://www.soundcityreading.net/uploads/3/7/6/1/37611941/
BASE = "https://www.soundcityreading.net/uploads/3/7/6/1/37611941/"

SOUND_URLS = {
    'a': f'{BASE}alphasounds-a.mp3',
    'b': f'{BASE}alphasounds-b.mp3',
    'c': f'{BASE}alphasounds-c.mp3',
    'd': f'{BASE}alphasounds-d.mp3',
    'e': f'{BASE}alphasounds-e.mp3',
    'f': f'{BASE}alphasounds-f.mp3',
    'g': f'{BASE}alphasounds-g.mp3',
    'h': f'{BASE}alphasounds-h.mp3',
    'i': f'{BASE}alphasounds-i.mp3',
    'j': f'{BASE}alphasounds-j.mp3',
    'k': f'{BASE}alphasounds-k.mp3',
    'l': f'{BASE}alphasounds-l.mp3',
    'm': f'{BASE}alphasounds-m.mp3',
    'n': f'{BASE}alphasounds-n.mp3',
    'o': f'{BASE}alphasounds-o-sh.mp3',  # Short O sound
    'p': f'{BASE}alphasounds-p-2.mp3',
    'q': f'{BASE}alphasounds-q.mp3',
    'r': f'{BASE}alphasounds-r.mp3',
    's': f'{BASE}alphasounds-s.mp3',
    't': f'{BASE}alphasounds-t.mp3',
    'u': f'{BASE}alphasounds-u-sh.mp3',  # Short U sound
    'v': f'{BASE}alphasounds-v.mp3',
    'w': f'{BASE}alphasounds-w.mp3',
    'x': f'{BASE}alphasounds-x.mp3',
    'y': f'{BASE}alphasounds-y.mp3',
    'z': f'{BASE}alphasounds-z.mp3',
}

# Simple headers
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
}

print("Downloading human-voice phonics audio from Sound City Reading...")
success_count = 0
fail_count = 0

for letter in "abcdefghijklmnopqrstuvwxyz":
    url = SOUND_URLS[letter]
    output_path = os.path.join(output_dir, f"{letter}.mp3")
    print(f"Downloading {letter}.mp3...")
    
    try:
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=30) as response:
            data = response.read()
            with open(output_path, 'wb') as f:
                f.write(data)
        
        file_size = os.path.getsize(output_path)
        if file_size > 500:  # More than 500 bytes suggests actual audio
            print(f"  ✓ Saved {letter}.mp3 ({file_size} bytes)")
            success_count += 1
        else:
            print(f"  ⚠ File too small ({file_size} bytes)")
            fail_count += 1
            
    except Exception as e:
        print(f"  ✗ Failed: {e}")
        fail_count += 1

print(f"\nDownload complete! Success: {success_count}, Failed: {fail_count}")
print(f"Files saved to {output_dir}/")
