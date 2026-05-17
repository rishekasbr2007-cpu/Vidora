import { createContext, useContext, useState, useCallback } from 'react';

const ProjectContext = createContext(null);

let folderId = 10;
let projectId = 10;

const DEFAULT_FOLDERS = [
  {
    id: 1, name: 'Master', isRoot: true, children: [
      { id: 2, name: 'Commercials', children: [] },
      { id: 3, name: 'Short Films', children: [] },
    ]
  },
];

const DEFAULT_PROJECTS = [
  { id: 1, folderId: 1, name: 'Untitled Project 1', createdAt: new Date().toISOString(), clips: [], mediaPool: [] },
];

export function ProjectProvider({ children }) {
  const [folders, setFolders] = useState(DEFAULT_FOLDERS);
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState(1);
  const [activeFolderId, setActiveFolderId] = useState(1);
  const [renamingFolderId, setRenamingFolderId] = useState(null);
  const [renamingProjectId, setRenamingProjectId] = useState(null);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  // Folder CRUD
  const createFolder = useCallback((parentId = 1, name = 'New Folder') => {
    const newFolder = { id: ++folderId, name, children: [] };
    setFolders(prev => {
      const addChild = (folders) => folders.map(f => {
        if (f.id === parentId) return { ...f, children: [...(f.children||[]), newFolder] };
        return { ...f, children: addChild(f.children||[]) };
      });
      return addChild(prev);
    });
    setTimeout(() => setRenamingFolderId(newFolder.id), 50);
    return newFolder;
  }, []);

  const renameFolder = useCallback((id, name) => {
    setFolders(prev => {
      const rename = (folders) => folders.map(f => {
        if (f.id === id) return { ...f, name };
        return { ...f, children: rename(f.children||[]) };
      });
      return rename(prev);
    });
    setRenamingFolderId(null);
  }, []);

  const deleteFolder = useCallback((id) => {
    setFolders(prev => {
      const del = (folders) => folders
        .filter(f => f.id !== id)
        .map(f => ({ ...f, children: del(f.children||[]) }));
      return del(prev);
    });
    setProjects(prev => prev.filter(p => p.folderId !== id));
  }, []);

  // Project CRUD
  const createProject = useCallback((fId = activeFolderId, name = 'Untitled Project') => {
    const newProj = {
      id: ++projectId, folderId: fId,
      name: `${name} ${projectId}`,
      createdAt: new Date().toISOString(),
      clips: [], mediaPool: [],
    };
    setProjects(prev => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    setTimeout(() => setRenamingProjectId(newProj.id), 50);
    return newProj;
  }, [activeFolderId]);

  const renameProject = useCallback((id, name) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name } : p));
    setRenamingProjectId(null);
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  }, [activeProjectId]);

  const updateProjectData = useCallback((id, data) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  // Flatten folders for tree
  const flattenFolders = (folders, depth = 0) => {
    let result = [];
    for (const f of folders) {
      result.push({ ...f, depth });
      result = result.concat(flattenFolders(f.children || [], depth + 1));
    }
    return result;
  };

  return (
    <ProjectContext.Provider value={{
      folders, projects, activeProject, activeProjectId, activeFolderId,
      renamingFolderId, renamingProjectId,
      setActiveProjectId, setActiveFolderId,
      setRenamingFolderId, setRenamingProjectId,
      createFolder, renameFolder, deleteFolder,
      createProject, renameProject, deleteProject, updateProjectData,
      flattenFolders,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);
