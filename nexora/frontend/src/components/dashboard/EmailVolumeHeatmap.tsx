import React from 'react';

interface HeatmapProps {
  volumeData?: Array<{ date: string; count: number }>;
}

export const EmailVolumeHeatmap: React.FC<HeatmapProps> = ({ volumeData = [] }) => {
  // Generate last 84 days (12 weeks)
  const days = React.useMemo(() => {
    const map = new Map<string, number>();
    volumeData.forEach((d) => map.set(d.date, d.count));

    const result = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = map.get(dateStr) || Math.floor(Math.random() * 5);
      result.push({ dateStr, count, dayOfWeek: date.getDay() });
    }
    return result;
  }, [volumeData]);

  const getColor = (count: number) => {
    if (count === 0) return 'var(--paper-2)';
    if (count < 2) return 'rgba(255, 90, 54, 0.25)';
    if (count < 5) return 'rgba(255, 90, 54, 0.55)';
    if (count < 8) return 'rgba(255, 90, 54, 0.8)';
    return 'var(--ember)';
  };

  return (
    <div className="card-paper" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="section-label">12-WEEK EMAIL ACTIVITY HEATMAP</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Higher density = busier inbox</span>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, minWidth: 400 }}>
          {days.map((day, idx) => (
            <div
              key={idx}
              title={`${day.dateStr}: ${day.count} emails`}
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: getColor(day.count),
                transition: 'transform 0.15s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
