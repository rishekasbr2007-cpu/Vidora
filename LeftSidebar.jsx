import { useRef, useState, useCallback } from 'react';
import { Folder, FolderOpen, Film, Music, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { useEditor } from '../store/EditorContext';
import { useProject } from '../store/ProjectContext';

function formatDur(s) {
  if (!s || s < 0.01) return '--:--';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function ProjectRow({ proj }) {
  const { activeProjectId, setActiveProjectId, renamingProjectId, setRenamingProjectId, renameProject, deleteProject } = useProject();
  const [name, setName] = useState(proj.name);
  const active = activeProjectId === proj.id;
  return (
    <div
      className={`folder-item ${active ? 'active' : ''}`}
      style={{ paddingLeft: 32 }}
      onClick={() => setActiveProjectId(proj.id)}
      onDoubleClick={() => setRenamingProjectId(proj.id)}
      onContextMenu={e => { e.preventDefault(); deleteProject(proj.id); }}
    >
      <Film size={11} style={{ color: 'var(--dv-blue)', flexShrink: 0 }} />
      {renamingProjectId === proj.id ? (
        <input className="folder-name-input" value={name} autoFocus
          onChange={e => setName(e.target.value)}
          onBlur={() => renameProject(proj.id, name || proj.name)}
          onKeyDown={e => { if (e.key === 'Enter') renameProject(proj.id, name || proj.name); if (e.key === 'Escape') setRenamingProjectId(null); }}
          onClick={e => e.stopPropagation()} />
      ) : (
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 11 }}>{proj.name}</span>
      )}
    </div>
  );
}

function FolderNode({ folder, depth = 0 }) {
  const { activeFolderId, setActiveFolderId, renamingFolderId, setRenamingFolderId, renameFolder, deleteFolder, createFolder, createProject, projects } = useProject();
  const [open, setOpen] = useState(true);
  const [name, setName] = useState(folder.name);
  const active = activeFolderId === folder.id;
  const folderProjects = projects.filter(p => p.folderId === folder.id);

  return (
    <div>
      <div className={`folder-item ${active ? 'active' : ''}`} style={{ paddingLeft: 6 + depth * 14 }}
        onClick={() => { setActiveFolderId(folder.id); setOpen(v => !v); }}
        onDoubleClick={() => setRenamingFolderId(folder.id)}
        onContextMenu={e => { e.preventDefault(); if (!folder.isRoot) deleteFolder(folder.id); }}>
        {open ? <ChevronDown size={10} style={{ flexShrink: 0 }} /> : <ChevronRight size={10} style={{ flexShrink: 0 }} />}
        {open ? <FolderOpen size={12} style={{ color: '#c8a840', flexShrink: 0 }} /> : <Folder size={12} style={{ color: '#c8a840', flexShrink: 0 }} />}
        {renamingFolderId === folder.id ? (
          <input className="folder-name-input" value={name} autoFocus
            onChange={e => setName(e.target.value)}
            onBlur={() => renameFolder(folder.id, name || folder.name)}
            onKeyDown={e => { if (e.key === 'Enter') renameFolder(folder.id, name || folder.name); if (e.key === 'Escape') setRenamingFolderId(null); }}
            onClick={e => e.stopPropagation()} />
        ) : (
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
        )}
      </div>
      {open && (
        <>
          {(folder.children || []).map(child => <FolderNode key={child.id} folder={child} depth={depth + 1} />)}
          {folderProjects.map(proj => <ProjectRow key={proj.id} proj={proj} />)}
        </>
      )}
    </div>
  );
}

export default function LeftSidebar() {
  const [tab, setTab] = useState('pool');
  const [view, setView] = useState('grid');
  const [dragOver, setDragOver] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const fileRef = useRef();
  const { 
    mediaPool, addMedia, setSourceMediaSrc, 
    VIDEO_TRANSITIONS, AUDIO_TRANSITIONS, OPENFX, GENERATORS, TITLES, AI_EFFECTS 
  } = useEditor();
  const { folders, activeFolderId, createFolder, createProject } = useProject();

  const handleFiles = useCallback((files) => {
    [...files].forEach(f => { if (f.type.startsWith('video/') || f.type.startsWith('audio/')) addMedia(f); });
  }, [addMedia]);

  const onSelectMedia = (item) => {
    setSelectedMedia(item.id);
    setSourceMediaSrc(item.src);
  };

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); };
  const dragStartMedia = (e, item) => { e.dataTransfer.setData('mediaId', item.id); e.dataTransfer.effectAllowed = 'copy'; };
  const dragStartEffect = (e, item) => { 
    e.dataTransfer.setData('effectId', item.id); 
    e.dataTransfer.setData('effectName', item.name);
    e.dataTransfer.effectAllowed = 'copy'; 
  };

  return (
    <div className="sidebar-left">
      <div className="sidebar-tabs">
        <button className={`sidebar-tab ${tab === 'bins' ? 'active' : ''}`} onClick={() => setTab('bins')}>Smart Bins</button>
        <button className={`sidebar-tab ${tab === 'pool' ? 'active' : ''}`} onClick={() => setTab('pool')}>Media Pool</button>
        <button className={`sidebar-tab ${tab === 'effects' ? 'active' : ''}`} onClick={() => setTab('effects')}>Effects</button>
      </div>

      {tab === 'bins' && (
        <>
          <div className="smart-bins">
            <div className="smart-bins-header">Smart Bins</div>
            {[['🎞', 'All Clips'], ['🎬', 'Video Clips'], ['🎵', 'Audio Clips'], ['✦', 'AI Generated'], ['⭐', 'Favorites']].map(([icon, label], i) => (
              <div key={label} className={`smart-bin-item ${i === 0 ? 'active' : ''}`}><span>{icon}</span>{label}</div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '5px 8px 3px', borderBottom: '1px solid var(--dv-border-dark)' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', flex: 1 }}>Folders</span>
            <button className="btn-icon" style={{ width: 20, height: 20 }} onClick={() => createFolder(activeFolderId)} title="New Folder"><Folder size={10} /></button>
            <button className="btn-icon" style={{ width: 20, height: 20 }} onClick={() => createProject(activeFolderId)} title="New Project"><Film size={10} /></button>
          </div>
          <div className="folder-tree">
            {folders.map(f => <FolderNode key={f.id} folder={f} />)}
          </div>
        </>
      )}

      {tab === 'pool' && (
        <>
          <div className="media-pool-toolbar">
            <span className="media-pool-toolbar-title">Media Pool</span>
            <button className="btn-icon" onClick={() => fileRef.current?.click()} title="Import media"><Plus size={11} /></button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
              <button className={`btn-icon ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>⊞</button>
              <button className={`btn-icon ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>≡</button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="video/*,audio/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />

          {mediaPool.length === 0 ? (
            <div className={`drop-zone-big ${dragOver ? 'over' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}>
              <Film size={32} style={{ opacity: 0.3 }} />
              <div className="dz-title">No clips in media pool</div>
              <div className="dz-sub">Add clips from Media Storage to get started</div>
            </div>
          ) : (
            <div className="media-grid"
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}>
              {view === 'grid' ? (
                <div className="media-grid-inner">
                  {mediaPool.map(item => (
                    <div key={item.id} className={`media-card ${selectedMedia === item.id ? 'selected' : ''}`}
                      draggable onDragStart={e => dragStartMedia(e, item)}
                      onClick={() => onSelectMedia(item)} title={item.name}>
                      <div className="media-thumb">
                        {item.isAiGenerated && <div className="media-thumb-ai">AI</div>}
                        {item.type === 'video' ? <video src={item.src} muted preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : item.type === 'audio' ? <Music size={18} style={{ color: 'var(--track-a-light)' }} />
                          : <Film size={18} style={{ color: 'var(--dv-text-muted)' }} />}
                        {item.duration > 0 && <div className="media-thumb-dur">{formatDur(item.duration)}</div>}
                      </div>
                      <div className="media-card-label">{item.name}</div>
                    </div>
                  ))}
                  <div className="media-card"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 60, border: '1px dashed var(--dv-border)', cursor: 'pointer', color: 'var(--dv-text-muted)', background: 'transparent' }}
                    onClick={() => fileRef.current?.click()}>
                    <Plus size={14} /><div style={{ fontSize: 9, marginTop: 3 }}>Import</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '2px 0' }}>
                  {mediaPool.map(item => (
                    <div key={item.id} className={`folder-item ${selectedMedia === item.id ? 'active' : ''}`}
                      draggable onDragStart={e => dragStartMedia(e, item)}
                      onClick={() => onSelectMedia(item)} style={{ gap: 7, paddingLeft: 8 }}>
                      {item.type === 'audio' ? <Music size={11} style={{ color: 'var(--track-a-light)', flexShrink: 0 }} /> : <Film size={11} style={{ color: 'var(--dv-blue)', flexShrink: 0 }} />}
                      {item.isAiGenerated && <span style={{ fontSize: 8, fontWeight: 700, background: 'var(--ai-orange)', color: '#fff', padding: '1px 3px', borderRadius: 2 }}>AI</span>}
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 11 }}>{item.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--dv-text-muted)' }}>{formatDur(item.duration)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'effects' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="media-pool-toolbar">
            <span className="media-pool-toolbar-title">Effects Library</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
            {[
              { label: 'Video Transitions', items: VIDEO_TRANSITIONS },
              { label: 'Audio Transitions', items: AUDIO_TRANSITIONS },
              { label: 'OpenFX', items: OPENFX },
              { label: 'Generators', items: GENERATORS },
              { label: 'Titles', items: TITLES },
              { label: 'AI Effects', items: AI_EFFECTS },
            ].map(group => (
              <div key={group.label} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#444', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{group.label}</div>
                {group.items.map(item => (
                  <div key={item.id} className="folder-item" draggable onDragStart={e => dragStartEffect(e, item)} style={{ gap: 8, paddingLeft: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color || '#444' }} />
                    <span style={{ fontSize: 11 }}>{item.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
