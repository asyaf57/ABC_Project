import React from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';

export default class KidModuleBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("KidModuleBoundary caught an isolated error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="module-error-fallback kid-card animate-pop" style={{ textAlign: 'center', padding: '30px 20px', margin: '20px 0' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🎈</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FF7043', fontSize: '1.5rem', marginBottom: '8px' }}>
            Ups, Modul Ini Sedang Istirahat Sejenak!
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '20px' }}>
            Jangan khawatir kawan, tab lainnya tetap berjalan dengan lancar. Sentuh tombol di bawah untuk memuat ulang modul ini ya!
          </p>
          <button 
            className="btn-kid btn-sound-vibrant" 
            style={{ '--btn-theme-color': '#FF7043', margin: '0 auto' }}
            onClick={this.handleReset}
          >
            <RotateCcw size={22} />
            <span>Muat Ulang Modul Ini</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
