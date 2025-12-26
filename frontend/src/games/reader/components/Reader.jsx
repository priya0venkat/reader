import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export function Reader({ word, onBack }) {
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        if (word) {
            loadStory();
        }
    }, [word]);

    // Pre-load voices on mount (Chrome requirement)
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        }
    }, []);

    // Absolute simplest speak function
    const speak = (text) => {
        if (!text) return;

        // 1. Create utterance
        const utterance = new SpeechSynthesisUtterance(text);

        // 2. Prevent Garbage Collection (Critical Fix)
        window.currentUtterance = utterance;

        // 3. Queue speech
        window.speechSynthesis.speak(utterance);

        // 4. Force resume to unstick engine (Chrome fix)
        setTimeout(() => {
            window.speechSynthesis.resume();
        }, 10);
    };

    const loadStory = async () => {
        setLoading(true);
        // speak(`Let's read about ${word}!`); // Minimized sound
        try {
            const res = await axios.post('/story', { word });
            setStory(res.data.story);
        } catch (err) {
            console.error(err);
            setStory('Error loading story. Ask a grown up!');
        } finally {
            setLoading(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            recognition.stop();
            setIsRecording(false);
        } else {
            // speak("Your turn!"); // Minimized sound
            recognition.start();
            setIsRecording(true);

            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setIsRecording(false);
                getFeedback(text);
            };
        }
    };

    const getFeedback = async (text) => {
        try {
            const res = await axios.post('/feedback', {
                original_text: story,
                transcript: text
            });
            setFeedback(res.data.feedback);

            // Plain TTS feedback, no confetti
            speak(res.data.feedback);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <button
                className="btn-secondary"
                onClick={onBack}
                style={{ position: 'absolute', left: '2rem', top: '2rem', borderRadius: '50%', width: '60px', height: '60px', padding: 0, justifyContent: 'center' }}
            >
                <ArrowLeft size={32} />
            </button>

            {loading ? (
                <div style={{ padding: '4rem' }}>
                    <Sparkles className="spin" size={64} color="var(--primary)" />
                    <h2 style={{ fontSize: '2rem' }}>Making Magic... ✨</h2>
                </div>
            ) : (
                <>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        {word}
                    </h2>

                    <div style={{
                        fontSize: '2.5rem',
                        lineHeight: '1.4',
                        marginBottom: '3rem',
                        padding: '2rem',
                        background: '#fff',
                        borderRadius: '1rem',
                        border: '2px dashed var(--secondary)',
                        cursor: 'pointer'
                    }} onClick={() => speak(story)}>
                        {story} 🔊
                    </div>

                    <motion.button
                        className="btn"
                        onClick={toggleRecording}
                        animate={{
                            scale: isRecording ? 1.2 : 1,
                            backgroundColor: isRecording ? 'var(--error)' : 'var(--primary)'
                        }}
                        style={{
                            fontSize: '2rem',
                            padding: '1.5rem 3rem',
                            borderRadius: '2rem'
                        }}
                    >
                        {isRecording ? <MicOff size={48} /> : <Mic size={48} />}
                        {isRecording ? 'Listening...' : 'My Turn!'}
                    </motion.button>
                </>
            )}
        </div>
    );
}
