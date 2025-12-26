import React from 'react';
import { Trophy, Star, Activity } from 'lucide-react';

const stats = [
    { label: 'Stars!', value: '12', icon: Star, color: '#FFD700' },
    { label: 'Streak!', value: '3', icon: Activity, color: '#FF69B4' },
];

export function Dashboard() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            {stats.map((stat) => (
                <div key={stat.label} className="card" style={{ padding: '1rem 2rem', border: `3px solid ${stat.color}` }}>
                    <div style={{ color: stat.color, marginBottom: '0.5rem' }}>
                        <stat.icon size={48} fill={stat.color} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stat.value}</div>
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
            ))}
        </div>
    );
}
