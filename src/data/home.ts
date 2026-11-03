import type { CatalogCategoryId } from './catalog'

// Homepage merchandising for this shop. Product IDs refer to the catalogue; unknown IDs are skipped.
export const heroClip = { name: 'hero', label: 'Looping clip of products from the store: a gaming headset, a speaker, a power bank, a smart watch and headphones' }

export const modes: { id: CatalogCategoryId; label: string; player: string; line: string; clip: string; clipLabel: string }[] = [
  { id: 'gaming', label: 'Game', player: 'Player 1', line: 'Headsets, mechanical keyboards and capture gear for your setup.', clip: 'mode-gaming', clipLabel: 'Looping clip of gaming headsets and a mechanical keyboard' },
  { id: 'audio', label: 'Listen', player: 'Player 2', line: 'Speakers, headphones and earbuds, from pocket size to party size.', clip: 'mode-audio', clipLabel: 'Looping clip of a portable speaker, headphones and earbuds' },
  { id: 'power', label: 'Power', player: 'Player 3', line: 'Power banks and fast chargers that keep everything running.', clip: 'mode-power', clipLabel: 'Looping clip of three power banks' },
  { id: 'creator', label: 'Create', player: 'Player 4', line: 'Gimbals, lights and wireless mics for your next video.', clip: 'mode-creator', clipLabel: 'Looping clip of a phone gimbal, a softbox light and a wireless microphone set' },
  { id: 'wearables', label: 'Wear', player: 'Player 5', line: 'Smart watches and fitness bands for every day.', clip: 'mode-wearables', clipLabel: 'Looping clip of smart watches and a fitness band' },
]

// A clean, recognisable photo for each category tile.
export const categorySampleIds: Partial<Record<CatalogCategoryId, string>> = {
  gaming: '205905310', audio: '194901050', power: '373431597', creator: '1759742233', wearables: '1773168823',
  computing: '1763458064', home: '734676912',
}

export const topPickIds = [
  '194901050', '204299407', '1759742233', '373431597', '1773168823', '755035463',
  '733424499', '1763458064', '448101111', '1761647214', '750139071', '277465537',
]
