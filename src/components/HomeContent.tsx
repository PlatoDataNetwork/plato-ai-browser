'use client';

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

interface HomeContentProps {
  onNavigate: (url: string) => void;
}

export function HomeContent({ onNavigate }: HomeContentProps) {
  return (
    <div className="flex flex-col items-center h-full bg-[#1a1b26] bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-orange-900/20 rounded-md p-12">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {QUICK_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => onNavigate(link.url)}
              className="group flex flex-col items-center bg-white cursor-0 rounded-[24px] p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="w-full flex items-center justify-center mb-4">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                  alt={link.name}
                  className="w-12 h-12 rounded-xl"
                />
              </div>
              <span className="text-md font-bold text-[#030716] text-center line-clamp-1">{link.name}</span>
              <span className="text-sm text-[#3e466a] mt-1.5">{link.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}