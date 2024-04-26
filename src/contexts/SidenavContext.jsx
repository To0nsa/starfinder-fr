import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SidenavContext = createContext();

export const useSidenav = () => useContext(SidenavContext);

export const SidenavProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const toggleSidenav = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSubMenu = useCallback((id) => {
    if (isExpanded || isHovered) {
      setActiveMenu(activeMenu === id ? null : id);
    }
  }, [isExpanded, isHovered, activeMenu]);

  useEffect(() => {
    if (!isExpanded && !isHovered) {
      setActiveMenu(null);
    }
  }, [isExpanded, isHovered]);

  const value = {
    toggleSidenav,
    isExpanded,
    setIsExpanded,
    isHovered,
    setIsHovered,
    activeMenu,
    setActiveMenu,
    handleMouseEnter,
    handleMouseLeave,
    toggleSubMenu
  };

  return (
    <SidenavContext.Provider value={value}>
      {children}
    </SidenavContext.Provider>
  );
};