from gtts import gTTS
import os

# Create directory
output_dir = "phonics_audio"
os.makedirs(output_dir, exist_ok=True)

# Heuristic mapping for blendable sounds
# "Pure sounds" are hard with TTS, often adding a schwa /uh/.
# We try to minimize this by using repeated consonants for continuous sounds
# and short "uh" endings for stops where necessary.
PHONICS_MAPPING = {
    'a': 'a', # Short 'a' like apple? gTTS 'a' is often 'ay'. Let's try 'apple' start? No, let's try 'at' without t? 
              # Better: Let's stick to the letter for now, or 'ah'. 
              # Actually, 'a' by itself in English TTS usually says 'ay'.
              # let's try "ah" for short o? 
              # 'aaa' might work.
              # Let's use a specific set.
    'a': 'apple', # Placeholder: User might want to clip this manually? Or I can try to find a "short a" sound. 
                  # "at" is /æ t/.
                  # If I just say the letter 'a' in lower case, sometimes it works.
                  # Let's try to just use "a" and see.
    'b': 'buh',
    'c': 'kuh',
    'd': 'duh',
    'e': 'eh',    # Short e like 'dge'? 'eh' usually works.
    'f': 'fffff',
    'g': 'guh',
    'h': 'huh',
    'i': 'ih',    # Short i
    'j': 'juh',
    'k': 'kuh',
    'l': 'lllll',
    'm': 'mmmmm',
    'n': 'nnnnn',
    'o': 'ah',    # Short o like 'octopus'
    'p': 'puh',
    'q': 'kwuh',
    'r': 'errr',  # 'rrrr' sometimes sounds like a motor. 'err' is closer to the r-controlled or pure /r/. 
                  # UFLI teaches /r/ as 'err' (growling sound).
    's': 'sssss',
    't': 'tuh',
    'u': 'uh',    # Short u like 'up'
    'v': 'vvvvv',
    'w': 'wuh',
    'x': 'ks',    # /ks/
    'y': 'yuh',
    'z': 'zzzzz'
}

# Overrides for better quality if needed
# 'a': 'a' might be 'ay'.
# Let's try a few variants for vowels.
PHONICS_MAPPING['a'] = 'ah' # approximate
PHONICS_MAPPING['a_short'] = 'at' # users can clip? 
# Let's just create files named a.mp3, b.mp3 etc.

print("Generating phonics audio...")

for letter in "abcdefghijklmnopqrstuvwxyz":
    if letter in PHONICS_MAPPING:
        text = PHONICS_MAPPING[letter]
    else:
        text = letter # Fallback
    
    filename = f"{output_dir}/{letter}.mp3"
    print(f"Generating {filename} from text: '{text}'")
    
    tts = gTTS(text=text, lang='en')
    tts.save(filename)

print("Done! Files saved to", output_dir)
