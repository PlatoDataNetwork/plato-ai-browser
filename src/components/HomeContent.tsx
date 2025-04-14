'use client';

import { useState } from 'react';

const QUICK_LINKS = [
  { name: 'gTrade Solana', url: 'https://sol.gains.trade', category: 'DEX' },
  { name: 'Jup.ag', url: 'https://jup.ag', category: 'DeFi' },
  { name: 'Solana Token Creator', url: 'https://slerf.tools/en-us', category: 'DeFi' },
  { name: 'marginfi', url: 'https://app.marginfi.com', category: 'DeFi' },
  { name: 'Save', url: 'https://save.finance', category: 'DeFi' },
  { name: 'Sharky', url: 'https://sharky.fi', category: 'DeFi' },
  { name: 'Raydium', url: 'https://raydium.io', category: 'Exchange' },
  { name: 'Saber', url: 'https://saberdao.so', category: 'Exchange' },
  // { name: 'Kamino Finance', url: 'https://app.kamino.finance', category: 'Exchange' },
  { name: 'Moonwalk Fitness', url: 'https://moonwalk.fit', category: 'Gaming' },
  { name: 'Slotana Coin Flip', url: 'https://slotana.io', category: 'Gaming' },
  { name: 'GNME MINING GAME', url: 'https://www.gnmemining.com', category: 'Gaming' },
  // { name: 'Layer3', url: 'https://layer3.xyz', category: 'Social' },
  // { name: 'Galxe', url: 'https://www.galxe.com', category: 'Social' },
  { name: 'Solpot', url: 'https://solpot.com', category: 'Gambling' },
  { name: 'Predict 6', url: 'https://predict6.gg', category: 'Gambling' },
  { name: 'SLM Games', url: 'https://slm.games', category: 'Gambling' },
  { name: 'RACE Poker', url: 'https://race.poker', category: 'Gambling' },
  { name: 'Magic Eden', url: 'https://magiceden.io', category: 'Marketplace' },
  { name: 'Honeyland', url: 'https://honey.land', category: 'Marketplace' },
  { name: 'SolSea', url: 'https://solsea.io', category: 'Marketplace' },
  { name: 'Solanart', url: 'https://solanart.io', category: 'Marketplace' },
  { name: 'Hype.fun', url: 'https://hype.fun', category: 'Marketplace' },
  { name: 'Cudis', url: 'https://www.cudis.xyz', category: 'Other' },
  { name: 'Sol Incinerator', url: 'https://sol-incinerator.com', category: 'Other' },
  { name: 'GamerBoom', url: 'https://gamerboom.org', category: 'Gaming' },
  { name: 'MomoAI', url: 'https://www.momoai.io', category: 'Other' },
  { name: 'QnA3', url: 'https://qna3.ai', category: 'Social' },
  { name: 'Hawksight', url: 'https://www.hawksight.co', category: 'DeFi' },
  { name: 'Streamflow', url: 'https://streamflow.finance', category: 'DeFi' },
  { name: 'Lavarage', url: 'https://lavarage.xyz', category: 'DeFi' },
];

const AGENT = [
  {
    "name": "AR / VR",
    "category": "AR / VR Intelligence",
    "image": "/agent/ar-vr.jpg"
  },
  {
    "name": "Cleantech",
    "category": "Clean Technology Intelligence",
    "image": "/agent/kZmK-cleantech-avatar.jpg"
  },
  {
    "name": "Aviation",
    "category": "Aviation Intelligence",
    "image": "/agent/hYOt-aviation-avatar.jpg"
  },
  {
    "name": "Defense",
    "category": "Defense Intelligence",
    "image": "/agent/Py94-defense-avatar.jpg"
  },
  {
    "name": "Carbon",
    "category": "Carbon Intelligence",
    "image": "/agent/Ni03-carbon-avatar.jpg"
  },
  {
    "name": "Cybersecurity",
    "category": "Cybersecurity Intelligence",
    "image": "/agent/R3M9-cybersecurity-avatar.jpg"
  },
  {
    "name": "Biotechnology",
    "category": "Biotechnology Intelligence",
    "image": "/agent/1Uv2-biotechnology-avatar.jpg"
  },
  {
    "name": "Clinical Trials",
    "category": "Clinical Trials Intelligence",
    "image": "/agent/GDUL-clinical-trials-avatar.jpg"
  },
  {
    "name": "Big Data",
    "category": "Big Data Intelligence",
    "image": "/agent/cv2t-big-data-avatar.jpg"
  },
  {
    "name": "Ecommerce",
    "category": "Ecommerce Intelligence",
    "image": "/agent/ZdnB-ecommerce-avatar.jpg"
  },
  {
    "name": "Crowdfunding",
    "category": "Crowdfunding Intelligence",
    "image": "/agent/Vvvd-crowdfunding-avatar.jpg"
  },
  {
    "name": "Aerospace",
    "category": "Aerospace Intelligence",
    "image": "/agent/TVn0-aerospace-avatar.jpg"
  },
  {
    "name": "Code",
    "category": "Coding Intelligence",
    "image": "/agent/Knml-code-avatar.jpg"
  },
  {
    "name": "EdTech",
    "category": "EdTech Intelligencee",
    "image": "/agent/0sFQ-edtech-avatar.jpg"
  },
  {
    "name": "Energy",
    "category": "Energy Intelligencee",
    "image": "/agent/wq0O-energy-avatar.jpg"
  },
  {
    "name": "Esports",
    "category": "Esports Intelligencee",
    "image": "/agent/kusr-esports-avatar.jpg"
  },
  {
    "name": "FinTech",
    "category": "FinTech Intelligence",
    "image": "/agent/kusr-esports-avatar.jpg"
  },
  {
    "name": "Forex",
    "category": "Forex Intelligence",
    "image": "/agent/5PF1-forex-avatar.jpg"
  },
  {
    "name": "Gaming",
    "category": "Gaming Intelligence",
    "image": "/agent/jaFq-gaming-avatar.jpg"
  },
  {
    "name": "IoT",
    "category": "IoT Intelligence",
    "image": "/agent/HzfL-iot-avatar.jpg"
  },
  {
    "name": "Medical Devices",
    "category": "Medical Device Intelligence",
    "image": "/agent/kP9F-medical-devices-avatar.jpg"
  },
  {
    "name": "Nano Technology",
    "category": "Nano Technology Intelligence",
    "image": "/agent/YTMr-nano-technology-avatar.jpg"
  },
  {
    "name": "NFTs",
    "category": "NFTs Intelligence",
    "image": "/agent/op48-nfts-avatar.jpg"
  },
  {
    "name": "Patents",
    "category": "Patents Intelligence",
    "image": "/agent/QzMv-patents-avatar.jpg"
  },
  {
    "name": "Payments",
    "category": "Payments Intelligence",
    "image": "/agent/al0Z-payments-avatar.jpg"
  },
  {
    "name": "Private Equity",
    "category": "Private Equity Intelligence",
    "image": "/agent/e1Km-private-equity-avatar.jpg"
  },
  {
    "name": "Cannabis",
    "category": "Cannabis Intelligence",
    "image": "/agent/VUIC-cannabis-avatar.jpg"
  },
  {
    "name": "Psychotropics",
    "category": "Psychotropics Intelligence",
    "image": "/agent/49gu-psychotropics-avatar.jpg"
  },
  {
    "name": "Quantum",
    "category": "Quantum Intelligence",
    "image": "/agent/p6zC-quantum-avatar.jpg"
  },
  {
    "name": "Real Estate",
    "category": "Real Estate Intelligence",
    "image": "/agent/RxqX-real-estate-avatar.jpg"
  },
  {
    "name": "Saas",
    "category": "Saas Intelligence",
    "image": "/agent/JrOT-saas-avatar.jpg"
  },
  {
    "name": "Semiconductor",
    "category": "Semiconductor Intelligence",
    "image": "/agent/Af6Y-semiconductor-avatar.jpg"
  },
  {
    "name": "SEO",
    "category": "SEO Intelligence",
    "image": "/agent/WLgV-seo-avatar.jpg"
  },
  {
    "name": "Solar",
    "category": "Solar Intelligence",
    "image": "/agent/QKgQ-solar-avatar.jpg"
  },
  {
    "name": "Startup",
    "category": "Startup Intelligence",
    "image": "/agent/cYi7-startups-avatar.jpg"
  },
  {
    "name": "Stem Cell",
    "category": "Stem Cell Intelligence",
    "image": "/agent/cpLZ-stem-cell-avatar.jpg"
  },
  {
    "name": "Supply Chain",
    "category": "Supply Chain Intelligence",
    "image": "/agent/2uyB-supply-chain-avatar.jpg"
  },
  {
    "name": "Trading",
    "category": "Trading Intelligence",
    "image": "/agent/VJNj-trading-avatar.jpg"
  },
  {
    "name": "Venture Capital",
    "category": "Venture Capital Intelligence",
    "image": "/agent/Y0Z6-venture-capital-avatar.jpg"
  },
  {
    "name": "Waste Management",
    "category": "Waste Management Intelligence",
    "image": "/agent/WLOE-waste-management-avatar.jpg"
  },
  {
    "name": "Blockchain",
    "category": "Blockchain Intelligence",
    "image": "/agent/FJ76-blockchain-avatar.jpg"
  },
  {
    "name": "AI",
    "category": "AI Intelligence",
    "image": "/agent/9JOW-ai-avatar.jpg"
  },
  {
    "name": "ESG",
    "category": "ESG Intelligence",
    "image": "/agent/cZ6t-esg-avatar.jpg"
  },
  {
    "name": "Plato Intelligence",
    "category": "Plato Intelligence",
    "image": "/agent/0m2c-plato-intelligence-avatar.jpg"
  },
  {
    "name": "Automotive",
    "category": "Automotive Intelligence",
    "image": "/agent/jg6q-automotive-avatar.jpg"
  }
];

interface HomeContentProps {
  onNavigate: (url: string) => void;
}

export function HomeContent({ onNavigate }: HomeContentProps) {
  const [activeTab, setActiveTab] = useState('Quick Links');

  const renderContent = () => {
    if (activeTab === 'Quick Links') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {QUICK_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => onNavigate(link.url)}
              className="group flex flex-col items-center bg-[#0a0a0a] border border-[#ffffff24] cursor-pointer rounded-[24px] p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="w-full flex items-center justify-center mb-4">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                  alt={link.name}
                  className="w-15 h-15 rounded-xl object-cover"
                />
              </div>
              <span className="text-md font-bold text-[#ededed] text-center line-clamp-1">{link.name}</span>
              <span className="text-sm text-[#a1a1a1] mt-1.5">{link.category}</span>
            </button>
          ))}
        </div>
      );
    } else if (activeTab === 'AI Agent') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {AGENT.map((agent) => (
            <button
              key={agent.name}
              className="group flex flex-col items-center  bg-[#0a0a0a] border border-[#ffffff24] cursor-pointer rounded-[24px] p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="w-full flex items-center justify-center mb-4">
                <img 
                  src={agent.image}
                  alt={agent.name}
                  className="w-15 h-15 rounded-xl object-cover"
                />
              </div>
              <span className="text-md font-bold text-[#ededed] text-center line-clamp-1">{agent.name}</span>
              <span className="text-sm text-[#a1a1a1] mt-1.5">{agent.category}</span>
            </button>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center h-full bg-[#1a1b26] bg-black rounded-md p-12">
      <div className="w-full max-w-7xl">
        <div className="flex justify-center space-x-4 mb-4">
          {['Quick Links', 'AI Agent'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg' : 'bg-[#3d4569] text-white hover:bg-[#32334a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {renderContent()}
      </div>
    </div>
  );
}