import nltk
from nltk.corpus import words
import random

# Ensure word list is downloaded
try:
    nltk.data.find('corpora/words')
except LookupError:
    nltk.download('words')

# EXPANDED Toddler Safe List
# We will primarily rely on this list to avoid obscure NLTK words.
SIMPLE_WORD_ALLOWLIST = {
    # ch
    'chip', 'chat', 'chop', 'chin', 'chug', 'check', 'rich', 'much',
    # sh
    'ship', 'shop', 'shed', 'shoe', 'fish', 'dish', 'wish', 'dash', 'shut',
    # th
    'this', 'that', 'thin', 'with', 'moth', 'bath', 'path', 'math',
    # at
    'cat', 'bat', 'rat', 'hat', 'mat', 'fat', 'sat', 'pat',
    # ig
    'pig', 'big', 'dig', 'wig', 'fig', 'jig', 'rig'
}

def get_words_by_pattern(pattern: str, limit: int = 5):
    """
    Returns a list of simple words containing the specified phonics pattern.
    """
    filtered_words = []
    
    # 1. Strictly prioritize our allowlist
    for w in SIMPLE_WORD_ALLOWLIST:
        if pattern.lower() in w.lower():
            filtered_words.append(w)
    
    # Shuffle and return unique matches
    unique_words = list(set(filtered_words))
    # Sort by length to show easiest first
    unique_words.sort(key=len)
    
    # If we have enough words, return them
    if len(unique_words) >= limit:
        return unique_words[:limit]
        
    return unique_words
