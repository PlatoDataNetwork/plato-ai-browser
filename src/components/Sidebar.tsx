'use client';

import React, { FC, useState } from 'react';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode | string;
  href?: string;
  children?: NavItem[];
}

interface SidebarProps {
  isOpen: boolean;
}

const navigationItems: NavItem[] = [
  {
    id: 'discover',
    label: 'Discover',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>',
    href: '/discover'
  },
  {
    id: 'plato-search',
    label: 'Plato Search',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>',
    href: '/search'
  },
  {
    id: 'plato-agents',
    label: 'PlatoAI Agents',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"></path></svg>',
    children: []
  },
  {
    id: 'plato-verticals',
    label: 'Plato Verticals',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM6.5 9L10 5.5 13.5 9H11v4H9V9H6.5zm11 6L14 18.5 10.5 15H13v-4h2v4h2.5z"></path></svg>',
    children: []
  },
  {
    id: 'plato-aistreams',
    label: 'Plato AiStreams',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z"></path></svg>',
    children: []
  },
  {
    id: 'plato-aicast',
    label: 'PlatoAiCast',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></svg>',
    href: '/aicast'
  },
  {
    id: 'plato-aiwire',
    label: 'Plato AiWire',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>',
    children: []
  },
  {
    id: 'plato-newswire',
    label: 'Plato Newswire',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>',
    children: []
  },
  {
    id: 'publications',
    label: 'Publications',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"></path></svg>',
    children: []
  },
  {
    id: 'defix-gateway',
    label: 'DeFiX Gateway',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></svg>',
    children: []
  },
  {
    id: 'market-data',
    label: 'Market Data',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>',
    children: []
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M23 8c0 1.1-.9 2-2 2a1.7 1.7 0 0 1-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56A1.7 1.7 0 0 1 19 8c0-1.1.9-2 2-2s2 .9 2 2z"></path></svg>',
    href: '/analytics'
  },
  {
    id: 'w3-metaverse',
    label: 'W3 Metaverse',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"></path></svg>',
    children: []
  },
  {
    id: 'protocol-registry',
    label: 'Protocol Registry',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"></path></svg>',
    href: '/protocol'
  },
  {
    id: 'zephyrnet',
    label: 'Zephyrnet',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></svg>',
    children: []
  },
  {
    id: 'amplifi-pr',
    label: 'AmpliFi PR',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>',
    href: '/amplifi'
  },
  {
    id: 'plato-support',
    label: 'Plato Support',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon" viewBox="0 0 24 24" fill="#04a1ff"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>',
    href: '/support'
  }
];

const footerLinks = [
  { id: 'terms', label: 'Terms of Use', href: '/terms' },
  { id: 'privacy', label: 'Privacy Policy', href: '/privacy' },
  { id: 'cookies', label: 'Cookies Policy', href: '/cookies' },
  { id: 'dmca', label: 'DMCA Notice', href: '/dmca' }
];

const NavItem: FC<{ item: NavItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(true);

  const renderIcon = (icon?: React.ReactNode | string) => {
    if (typeof icon === 'string') {
      if (icon.startsWith('<svg')) {
        return <span className="w-6" dangerouslySetInnerHTML={{ __html: icon }} />;
      }
      return <span className="w-6">{icon}</span>;
    }
    return <span className="w-6">{icon}</span>;
  };

  return (
    <div className="py-1">
      {item.href ? (
        <Link 
          href={item.href}
          className="flex items-center px-4 py-2 gap-2 text-gray-300 hover:text-white hover:bg-[#000] rounded-md transition-colors"
        >
          {renderIcon(item.icon)}
          <span>{item.label}</span>
        </Link>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:text-white hover:bg-[#000] rounded-md transition-colors"
        >
          <div className="flex items-center gap-2">
            {renderIcon(item.icon)}
            <span>{item.label}</span>
          </div>
          {item.children && (
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      )}
      {item.children && isOpen && (
        <div className="ml-6 mt-1">
          {item.children.map((child) => (
            <NavItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={`w-64 bg-[#0a0a0a] ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex flex-col h-full">
        <nav className="flex-1 overflow-y-auto py-4 px-1">
          {navigationItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>
        
        <div className="border-t border-gray-700 py-4 px-1">
          {footerLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;