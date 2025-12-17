import React from 'react';
import { Trophy, Star, Activity } from 'lucide-react';

// Mock Data
const stats = [
    { label: 'Words Mastered', value: '12', icon: Trophy, color: '#fbbf24' },
    { label: 'Current Streak', value: '3 Days', icon: Activity, color: '#f472b6' },
    { label: 'Total Stars', value: '45', icon: Star, color: '#a855f7' },
];

export function Dashboard() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {stats.map((stat) => (
                <div key={stat.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        padding: '1rem',
                        borderRadius: '50%',
                        background: `${stat.color}20`,
                        color: stat.color
                    }}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
