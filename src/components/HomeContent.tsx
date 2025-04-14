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
    "image": "/agent/ar-vr.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/ar-vr-WOmzD"
  },
  {
    "name": "Cleantech",
    "category": "Clean Technology Intelligence",
    "image": "/agent/kZmK-cleantech-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/cleantech-AS3Y0"
  },
  {
    "name": "Aviation",
    "category": "Aviation Intelligence",
    "image": "/agent/hYOt-aviation-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/aviation-aowaE"
  },
  {
    "name": "Defense",
    "category": "Defense Intelligence",
    "image": "/agent/Py94-defense-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/defense-FKoSR"
  },
  {
    "name": "Carbon",
    "category": "Carbon Intelligence",
    "image": "/agent/Ni03-carbon-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/carbon-J6sJV"
  },
  {
    "name": "Cybersecurity",
    "category": "Cybersecurity Intelligence",
    "image": "/agent/R3M9-cybersecurity-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/cybersecurity-YFK6Z"
  },
  {
    "name": "Biotechnology",
    "category": "Biotechnology Intelligence",
    "image": "/agent/1Uv2-biotechnology-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/biotechnology-9Lx8C"
  },
  {
    "name": "Clinical Trials",
    "category": "Clinical Trials Intelligence",
    "image": "/agent/GDUL-clinical-trials-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/clinical-trials-xIR5l"
  },
  {
    "name": "Big Data",
    "category": "Big Data Intelligence",
    "image": "/agent/cv2t-big-data-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/big-data-rGb61"
  },
  {
    "name": "Ecommerce",
    "category": "Ecommerce Intelligence",
    "image": "/agent/ZdnB-ecommerce-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/ecommerce-tRTfU"
  },
  {
    "name": "Crowdfunding",
    "category": "Crowdfunding Intelligence",
    "image": "/agent/Vvvd-crowdfunding-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/crowdfunding-HT6Qv"
  },
  {
    "name": "Aerospace",
    "category": "Aerospace Intelligence",
    "image": "/agent/TVn0-aerospace-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/aerospace-ABEUs"
  },
  {
    "name": "Code",
    "category": "Coding Intelligence",
    "image": "/agent/Knml-code-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/code-wgCAB"
  },
  {
    "name": "EdTech",
    "category": "EdTech Intelligencee",
    "image": "/agent/0sFQ-edtech-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/edtech-OjER2"
  },
  {
    "name": "Energy",
    "category": "Energy Intelligencee",
    "image": "/agent/wq0O-energy-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/energy-aqjOo"
  },
  {
    "name": "Esports",
    "category": "Esports Intelligencee",
    "image": "/agent/kusr-esports-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/esports-GcHxn"
  },
  {
    "name": "FinTech",
    "category": "FinTech Intelligence",
    "image": "/agent/kusr-esports-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/fintech-qFjVs"
  },
  {
    "name": "Forex",
    "category": "Forex Intelligence",
    "image": "/agent/5PF1-forex-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/forex-ltcxe"
  },
  {
    "name": "Gaming",
    "category": "Gaming Intelligence",
    "image": "/agent/jaFq-gaming-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/gaming-2bBJM"
  },
  {
    "name": "IoT",
    "category": "IoT Intelligence",
    "image": "/agent/HzfL-iot-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/iot-sfDZe"
  },
  {
    "name": "Medical Devices",
    "category": "Medical Device Intelligence",
    "image": "/agent/kP9F-medical-devices-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/medical-devices-qe4BI"
  },
  {
    "name": "Nano Technology",
    "category": "Nano Technology Intelligence",
    "image": "/agent/YTMr-nano-technology-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/nano-technology-p6sIA"
  },
  {
    "name": "NFTs",
    "category": "NFTs Intelligence",
    "image": "/agent/op48-nfts-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/nfts-XYq9k"
  },
  {
    "name": "Patents",
    "category": "Patents Intelligence",
    "image": "/agent/QzMv-patents-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/patents-nVSCk"
  },
  {
    "name": "Payments",
    "category": "Payments Intelligence",
    "image": "/agent/al0Z-payments-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/payments-BJNDe"
  },
  {
    "name": "Private Equity",
    "category": "Private Equity Intelligence",
    "image": "/agent/e1Km-private-equity-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/private-equity-eEOkP"
  },
  {
    "name": "Cannabis",
    "category": "Cannabis Intelligence",
    "image": "/agent/VUIC-cannabis-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/cannabis-YuBpZ"
  },
  {
    "name": "Psychotropics",
    "category": "Psychotropics Intelligence",
    "image": "/agent/49gu-psychotropics-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/psychotropics-YVZvd"
  },
  {
    "name": "Quantum",
    "category": "Quantum Intelligence",
    "image": "/agent/p6zC-quantum-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/quantum-3BjgT"
  },
  {
    "name": "Real Estate",
    "category": "Real Estate Intelligence",
    "image": "/agent/RxqX-real-estate-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/real-estate-kep6A"
  },
  {
    "name": "Saas",
    "category": "Saas Intelligence",
    "image": "/agent/JrOT-saas-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/saas-2r9aa"
  },
  {
    "name": "Semiconductor",
    "category": "Semiconductor Intelligence",
    "image": "/agent/Af6Y-semiconductor-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/semiconductor-m8oq1"
  },
  {
    "name": "SEO",
    "category": "SEO Intelligence",
    "image": "/agent/WLgV-seo-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/seo-VBY1J"
  },
  {
    "name": "Solar",
    "category": "Solar Intelligence",
    "image": "/agent/QKgQ-solar-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/solar-IoSGq"
  },
  {
    "name": "Startup",
    "category": "Startup Intelligence",
    "image": "/agent/cYi7-startups-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/startups-l60Zy"
  },
  {
    "name": "Stem Cell",
    "category": "Stem Cell Intelligence",
    "image": "/agent/cpLZ-stem-cell-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/stem-cell-Tmzb9"
  },
  {
    "name": "Supply Chain",
    "category": "Supply Chain Intelligence",
    "image": "/agent/2uyB-supply-chain-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/supply-chain-iRRQP"
  },
  {
    "name": "Trading",
    "category": "Trading Intelligence",
    "image": "/agent/VJNj-trading-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/trading-QXQtS"
  },
  {
    "name": "Venture Capital",
    "category": "Venture Capital Intelligence",
    "image": "/agent/Y0Z6-venture-capital-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/venture-capital-mMYMg"
  },
  {
    "name": "Waste Management",
    "category": "Waste Management Intelligence",
    "image": "/agent/WLOE-waste-management-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/waste-management-hqKpA"
  },
  {
    "name": "Blockchain",
    "category": "Blockchain Intelligence",
    "image": "/agent/FJ76-blockchain-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/blockchain-VP6Gu"
  },
  {
    "name": "AI",
    "category": "AI Intelligence",
    "image": "/agent/9JOW-ai-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/ai-MTXjF"
  },
  {
    "name": "ESG",
    "category": "ESG Intelligence",
    "image": "/agent/cZ6t-esg-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/esg-4gDJB"
  },
  {
    "name": "Plato Intelligence",
    "category": "Plato Intelligence",
    "image": "/agent/0m2c-plato-intelligence-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/plato-intelligence-Wc2Xp"
  },
  {
    "name": "Automotive",
    "category": "Automotive Intelligence",
    "image": "/agent/jg6q-automotive-avatar.jpg",
    "link" : "https://phplaravel-1277108-5416810.cloudwaysapps.com/dashboard/user/openai/chat/ai-chat/automotive-zjwtP"
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
              onClick={() => onNavigate(agent.link)}
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