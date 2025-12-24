import { bundles } from '../data/bundles';

function BundleSelector({ onSelectBundle }) {
    return (
        <div className="bundle-selector">
            <h2>Choose a Bundle</h2>
            <div className="bundle-grid">
                {bundles.map(bundle => (
                    <button
                        key={bundle.id}
                        className="bundle-card"
                        onClick={() => onSelectBundle(bundle)}
                    >
                        <h3>{bundle.title}</h3>
                        <p>{bundle.description}</p>
                    </button>
                ))}
            </div>
            <style>{`
        .bundle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .bundle-card {
          background: var(--surface);
          color: var(--text);
          padding: 2rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          transition: transform 0.2s, box-shadow 0.2s;
          text-align: left;
        }
        .bundle-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          background: var(--primary);
        }
        .bundle-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }
      `}</style>
        </div>
    );
}

export default BundleSelector;
