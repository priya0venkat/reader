#!/usr/bin/env python3
"""
Download human-voice phonics audio files from ShowAndTellLetter.com
with proper headers to bypass hotlink protection.
"""
import os
import urllib.request

output_dir = "phonics_audio_human"
os.makedirs(output_dir, exist_ok=True)

# Direct URLs from ShowAndTellLetter.com
SOUND_URLS = {
    'a': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/1-1Aa.mp3',
    'b': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/2-1Bb.mp3',
    'c': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/3-1C-c.mp3',
    'd': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/4-1D-d.mp3',
    'e': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/5-1Ee.mp3',
    'f': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/6-1Ff.mp3',
    'g': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/7-1Gg.mp3',
    'h': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/8-1Hh.mp3',
    'i': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/9-1Ii.mp3',
    'j': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/10-1Jj.mp3',
    'k': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/11-1Kk.mp3',
    'l': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/12-1Ll.mp3',
    'm': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/13-1Mm.mp3',
    'n': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/14-1Nn.mp3',
    'o': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/15-1Oo.mp3',
    'p': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/16-1Pp.mp3',
    'q': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/17-1Qq.mp3',
    'r': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/18-1Rr.mp3',
    's': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/19-1Ss.mp3',
    't': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/20-1Tt.mp3',
    'u': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/21-1Uu.mp3',
    'v': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/22-1Vv.mp3',
    'w': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/23-1Ww.mp3',
    'x': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/24-1Xx.mp3',
    'y': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/25-1Yy.mp3',
    'z': 'https://www.showandtellletter.com/wp-content/uploads/2025/04/26-1Zz.mp3',
}

# Browser-like headers
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.showandtellletter.com/alphabet-sounds',
    'Accept': 'audio/mpeg, audio/*, */*',
}

print("Downloading human-voice phonics audio files...")
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
        if file_size > 1000:  # More than 1KB suggests actual audio
            print(f"  ✓ Saved {letter}.mp3 ({file_size} bytes)")
            success_count += 1
        else:
            print(f"  ⚠ File too small ({file_size} bytes), might be an error page")
            fail_count += 1
            
    except Exception as e:
        print(f"  ✗ Failed: {e}")
        fail_count += 1

print(f"\nDownload complete! Success: {success_count}, Failed: {fail_count}")
print(f"Files saved to {output_dir}/")
