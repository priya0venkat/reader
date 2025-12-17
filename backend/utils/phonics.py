import nltk
from nltk.corpus import words
import re
import random

# Ensure word list is downloaded
try:
    nltk.data.find('corpora/words')
except LookupError:
    nltk.download('words')

def get_words_by_pattern(pattern: str, limit: int = 10):
    """
    Returns a list of words containing the specified phonics pattern.
    """
    word_list = words.words()
    # Filter for words that contain the pattern (case insensitive)
    # and are suitable length (e.g., 3-8 chars) for young readers
    filtered_words = [
        w.lower() for w in word_list 
        if pattern.lower() in w.lower() 
        and 3 <= len(w) <= 8
        and w.isalpha()
    ]
    
    # Shuffle and return unique matches
    unique_words = list(set(filtered_words))
    random.shuffle(unique_words)
    return unique_words[:limit]

if __name__ == "__main__":
    # Test
    print(get_words_by_pattern("ch"))
