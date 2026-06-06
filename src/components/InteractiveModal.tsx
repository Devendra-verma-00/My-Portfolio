import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Lock, Award, CheckCircle, AlertTriangle, 
  Terminal, Database, Server, RefreshCw, Cpu, Activity, Info
} from 'lucide-react';
import { Project, Certification } from '../types';

interface InteractiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'project' | 'certification';
  project?: Project | null;
  certification?: Certification | null;
}



export const InteractiveModal: React.FC<InteractiveModalProps> = ({
  isOpen,
  onClose,
  type,
  project,
  certification
}) => {
  // WAF Simulator states
  const [activeTab, setActiveTab] = useState<'info' | 'architecture' | 'simulator'>('info');
  const [payloadInput, setPayloadInput] = useState<string>("' OR '1'='1' --");
  const [simulationLog, setSimulationLog] = useState<any[]>([]);
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [blockedCount, setBlockedCount] = useState<number>(12345);
  const [sqliCount, setSqliCount] = useState<number>(533);
  const [xssCount, setXssCount] = useState<number>(256);

  // Certification image upload states
  const [localCertImg, setLocalCertImg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && type === 'certification' && certification?.id) {
      const saved = localStorage.getItem(`cert-image-${certification.id}`);
      setLocalCertImg(saved);
      setImageError(false);
    } else {
      setLocalCertImg(null);
      setImageError(false);
    }
  }, [isOpen, certification, type]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && certification?.id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem(`cert-image-${certification.id}`, base64String);
        setLocalCertImg(base64String);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && certification?.id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem(`cert-image-${certification.id}`, base64String);
        setLocalCertImg(base64String);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (certification?.id) {
      localStorage.removeItem(`cert-image-${certification.id}`);
      setLocalCertImg(null);
      setImageError(false);
    }
  };

  // WAF attack pattern matching
  const runSimulation = () => {
    if (!payloadInput.trim()) return;
    setIsBlocking(true);
    
    setTimeout(() => {
      const logId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const ip = `103.45.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
      const timestamp = new Date().toLocaleTimeString();
      let attackType = 'Safe Request';
      let isBlocked = false;
      let alertMsg = 'Request is clean, passed to web server.';

      const input = payloadInput.toLowerCase();
      if (input.includes('union') || input.includes('select') || input.includes("'") || input.includes('or 1=1') || input.includes('--')) {
        attackType = 'SQL Injection';
        isBlocked = true;
        alertMsg = 'CRITICAL: Host malicious pattern matched on query parser! Access denied.';
        setSqliCount(p => p + 1);
        setBlockedCount(p => p + 1);
      } else if (input.includes('<script>') || input.includes('alert(') || input.includes('onload=') || input.includes('onerror=')) {
        attackType = 'Cross-Site Scripting (XSS)';
        isBlocked = true;
        alertMsg = 'HIGH: Injectable DOM vector intercepted! ModSecurity blocking rule applied.';
        setXssCount(p => p + 1);
        setBlockedCount(p => p + 1);
      }

      const newLog = {
        id: logId,
        ip,
        timestamp,
        payload: payloadInput,
        attackType,
        isBlocked,
        alertMsg
      };

      setSimulationLog(prev => [newLog, ...prev].slice(0, 10));
      setIsBlocking(false);
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-cyber-card border border-cyber-cyan/30 rounded-xl overflow-hidden shadow-2xl flex flex-col glow-cyber animate-[fadeIn_0.2s_ease-out]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-cyan/20 bg-cyber-bg/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-cyber-cyan">
              {type === 'project' ? '🛡️' : '🏆'}
            </span>
            <h3 className="font-display text-xl font-bold tracking-wider text-cyber-text">
              {type === 'project' ? project?.title : (certification?.name || 'TCS CodeVita Rank Certificate')}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2 text-cyber-muted hover:text-cyber-cyan border border-transparent hover:border-cyber-cyan/30 rounded transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {type === 'project' && project && (
            <div className="space-y-6">
              {/* Project Title Subline */}
              <div>
                <p className="text-cyber-cyan font-mono text-sm uppercase tracking-widest">PROJECT SPECIFICATION</p>
                <h4 className="text-xl font-medium mt-1">{project.subtitle}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-[fadeIn_0.15s_ease-out]">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h5 className="font-display text-cyber-cyan text-xs tracking-wider uppercase mb-2">PROJECT DESCRIPTION</h5>
                    <p className="text-cyber-muted leading-relaxed text-sm md:text-base">
                      {project.desc}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-display text-cyber-cyan text-xs tracking-wider uppercase mb-2">KEY FEATURES / IMPLEMENTATION</h5>
                    <ul className="grid grid-cols-1 gap-2 text-sm text-cyber-muted">
                      {project.features.map((f, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-cyber-cyan mt-1">◈</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-cyber-bg/50 border border-cyber-cyan/10 rounded-lg">
                    <h5 className="font-display text-cyber-cyan text-xs tracking-wider uppercase mb-3">TECHNOLOGY STACK</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t, idx) => (
                        <span key={idx} className="px-2 py-1 bg-cyber-purple/10 border border-cyber-purple/30 rounded text-xs text-cyber-purple font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

              {/* Certification Real Image / Dynamic Uploader Section */}
              {type === 'certification' && (() => {
                const displayImg = !imageError && certification?.image ? certification.image : null;
                return (
                  <div className="flex flex-col items-center justify-center py-4 animate-[fadeIn_0.15s_ease-out] w-full max-w-2xl mx-auto">
                    {displayImg ? (
                      <div className="flex flex-col items-center w-full">
                        <div className="relative w-full bg-[#0b0f19]/80 border border-cyber-cyan/30 rounded-2xl overflow-hidden p-2 shadow-2xl transition-all duration-300">
                          <img 
                            src={displayImg} 
                            alt={certification?.name}
                            referrerPolicy="no-referrer"
                            onError={() => setImageError(true)}
                            className="w-full h-auto object-contain max-h-[65vh] rounded-xl mx-auto"
                          />
                        </div>

                        <div className="w-full mt-4 p-4 bg-cyber-card/40 border border-cyber-border rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
                          <div className="text-left w-full sm:w-auto">
                            <h4 className="font-serif italic text-base text-cyber-text leading-tight">{certification?.name}</h4>
                            <span className="text-[10px] font-mono text-cyber-purple tracking-widest uppercase mt-0.5 block">{certification?.issuer}</span>
                          </div>
                          {certification?.credentialId && (
                            <div className="font-mono text-xs bg-cyber-bg/50 px-3 py-1 border border-cyber-border rounded text-cyber-muted whitespace-nowrap shrink-0">
                              {certification.credentialId}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-lg border border-cyber-border rounded-3xl p-8 text-center bg-cyber-card/10">
                        <p className="text-base font-semibold text-cyber-text mb-2">Certificate image is unavailable.</p>
                        <p className="text-xs text-cyber-muted">Image upload is disabled on the deployed website.</p>
                      </div>
                    )}
                  </div>
                );
              })()}
        </div>
      </div>
    </div>
  );
};