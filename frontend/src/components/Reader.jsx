import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export function Reader({ word, onBack }) {
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState(null);

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        if (word) {
            loadStory();
        }
    }, [word]);

    const loadStory = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/story', { word });
            setStory(res.data.story);
        } catch (err) {
            console.error(err);
            setStory('Error loading story. Check backend.');
        } finally {
            setLoading(false);
        }
    };

    const toggleRecording = () => {
        if (!recognition) {
            alert("Browser doesn't support speech recognition.");
            return;
        }

        if (isRecording) {
            recognition.stop();
            setIsRecording(false);
        } else {
            recognition.start();
            setIsRecording(true);
            setTranscript('Listening...');

            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                getFeedback(text);
            };

            recognition.onerror = (event) => {
                console.error(event.error);
                setIsRecording(false);
            };
        }
    };

    const getFeedback = async (text) => {
        try {
            const res = await axios.post('http://localhost:8000/feedback', {
                original_text: story,
                transcript: text
            });
            setFeedback(res.data.feedback);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1rem' }}>
                &larr; Back
            </button>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Sparkles className="spin" /> Generating Story for <b>{word}</b>...
                </div>
            ) : (
                <>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
                        Story Time: {word}
                    </h2>
                    <div style={{
                        fontSize: '1.5rem',
                        lineHeight: '2',
                        marginBottom: '2rem',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '0.5rem'
                    }}>
                        {story}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                        <motion.button
                            className="btn"
                            onClick={toggleRecording}
                            animate={{
                                backgroundColor: isRecording ? 'var(--error)' : 'var(--primary)',
                                scale: isRecording ? 1.1 : 1
                            }}
                        >
                            {isRecording ? <MicOff /> : <Mic />}
                            {isRecording ? 'Stop Recording' : 'Read Aloud'}
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {transcript && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}
                            >
                                You said: "{transcript}"
                            </motion.div>
                        )}

                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card"
                                style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--success)' }}
                            >
                                <h3 style={{ color: 'var(--success)', marginTop: 0 }}>Coach Says:</h3>
                                <p>{feedback}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}
