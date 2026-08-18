import { SubscriptionCategory } from '../types';

export interface IconOption {
  id: string;
  name: string;
  category: SubscriptionCategory | 'All';
  keywords: string[];
}

export const LUCIDE_ICON_OPTIONS: IconOption[] = [
  // Streaming & Media
  { id: 'Tv', name: 'TV & Shows', category: 'Streaming', keywords: ['tv', 'television', 'netflix', 'hulu', 'screen', 'stream'] },
  { id: 'Film', name: 'Cinema & Film', category: 'Streaming', keywords: ['film', 'movie', 'cinema', 'video', 'chorki', 'hoichoi'] },
  { id: 'Video', name: 'Video & Youtube', category: 'Streaming', keywords: ['video', 'youtube', 'vimeo', 'stream', 'camera'] },
  { id: 'Music', name: 'Music & Audio', category: 'Streaming', keywords: ['music', 'spotify', 'audio', 'song', 'listen', 'podcast'] },
  { id: 'Radio', name: 'Radio & Podcasts', category: 'Streaming', keywords: ['radio', 'broadcast', 'podcast', 'audio'] },
  { id: 'Headphones', name: 'Headphones', category: 'Streaming', keywords: ['headphones', 'headset', 'audio', 'music', 'sound'] },

  // Software & Developer Tools
  { id: 'Code', name: 'Code & Dev', category: 'Software', keywords: ['code', 'github', 'programming', 'developer', 'software'] },
  { id: 'Terminal', name: 'Terminal & CLI', category: 'Software', keywords: ['terminal', 'cli', 'bash', 'console', 'developer'] },
  { id: 'FolderGit2', name: 'Git & Repos', category: 'Software', keywords: ['git', 'repo', 'version', 'github', 'gitlab'] },
  { id: 'Cpu', name: 'CPU & Compute', category: 'Software', keywords: ['cpu', 'processor', 'hardware', 'compute', 'tech'] },
  { id: 'Layers', name: 'Framework & Stacks', category: 'Software', keywords: ['layers', 'stack', 'software', 'architecture'] },
  { id: 'Shield', name: 'Security & Antivirus', category: 'Software', keywords: ['security', 'shield', 'vpn', 'antivirus', 'protection'] },

  // Productivity & AI
  { id: 'Bot', name: 'AI & Chatbots', category: 'Productivity', keywords: ['bot', 'ai', 'chatgpt', 'claude', 'gemini', 'assistant'] },
  { id: 'Sparkles', name: 'Generative AI', category: 'Productivity', keywords: ['sparkles', 'ai', 'midjourney', 'magic', 'generative'] },
  { id: 'Layout', name: 'Design & Canvas', category: 'Productivity', keywords: ['layout', 'figma', 'design', 'canva', 'sketch'] },
  { id: 'Palette', name: 'Creative Arts', category: 'Productivity', keywords: ['palette', 'adobe', 'art', 'draw', 'photoshop', 'illustrator'] },
  { id: 'Zap', name: 'Automation & Fast', category: 'Productivity', keywords: ['zap', 'power', 'zapier', 'notion', 'boost', 'fast'] },
  { id: 'CheckCircle2', name: 'Tasks & Todo', category: 'Productivity', keywords: ['check', 'todo', 'tasks', 'done', 'productivity', 'jira', 'trello'] },
  { id: 'FileText', name: 'Documents & Notes', category: 'Productivity', keywords: ['file', 'doc', 'notion', 'google docs', 'notes', 'text'] },
  { id: 'Mail', name: 'Email & Inbox', category: 'Productivity', keywords: ['mail', 'email', 'gmail', 'outlook', 'inbox', 'superhuman'] },
  { id: 'MessageSquare', name: 'Team Chat', category: 'Productivity', keywords: ['chat', 'slack', 'discord', 'message', 'teams'] },
  { id: 'Briefcase', name: 'Office & Work', category: 'Productivity', keywords: ['briefcase', 'work', 'office', 'business', 'job'] },

  // Cloud & Hosting
  { id: 'Cloud', name: 'Cloud Storage', category: 'Cloud & Hosting', keywords: ['cloud', 'google one', 'drive', 'icloud', 'dropbox', 'onedrive'] },
  { id: 'Database', name: 'Database & SQL', category: 'Cloud & Hosting', keywords: ['database', 'sql', 'storage', 'data', 'supabase', 'firebase'] },
  { id: 'Server', name: 'Server & VPS', category: 'Cloud & Hosting', keywords: ['server', 'vps', 'aws', 'gcp', 'digitalocean', 'host'] },
  { id: 'HardDrive', name: 'Backup & Disk', category: 'Cloud & Hosting', keywords: ['disk', 'backup', 'storage', 'drive', 'hard drive'] },
  { id: 'Globe', name: 'Domains & Web', category: 'Cloud & Hosting', keywords: ['globe', 'domain', 'web', 'dns', 'hosting', 'site'] },

  // Gaming
  { id: 'Gamepad2', name: 'Gaming Console', category: 'Gaming', keywords: ['game', 'gaming', 'playstation', 'xbox', 'nintendo', 'steam', 'gamepad'] },
  { id: 'Gamepad', name: 'Controller', category: 'Gaming', keywords: ['gamepad', 'controller', 'arcade', 'play'] },
  { id: 'Trophy', name: 'Esports & Gaming', category: 'Gaming', keywords: ['trophy', 'game', 'win', 'achievement', 'esports'] },

  // Health & Fitness
  { id: 'Dumbbell', name: 'Gym & Weights', category: 'Health & Fitness', keywords: ['gym', 'fitness', 'workout', 'weights', 'exercise', 'training'] },
  { id: 'Heart', name: 'Health & Wellness', category: 'Health & Fitness', keywords: ['heart', 'health', 'wellness', 'medical', 'cardio'] },
  { id: 'Activity', name: 'Activity & Tracker', category: 'Health & Fitness', keywords: ['activity', 'strava', 'tracker', 'whoop', 'fitbit', 'run'] },

  // Utilities & Home
  { id: 'Wifi', name: 'Internet & Fiber', category: 'Utilities', keywords: ['wifi', 'internet', 'fiber', 'broadband', 'isp', 'network'] },
  { id: 'Home', name: 'Home & Utilities', category: 'Utilities', keywords: ['home', 'rent', 'housing', 'utilities', 'electricity', 'water'] },
  { id: 'Smartphone', name: 'Mobile Carrier', category: 'Utilities', keywords: ['phone', 'mobile', 'telecom', 'sim', 'grameenphone', 'robi'] },

  // Shopping & Delivery
  { id: 'ShoppingBag', name: 'Shopping & E-Com', category: 'Shopping & Delivery', keywords: ['shopping', 'amazon', 'prime', 'store', 'cart', 'delivery'] },
  { id: 'Coffee', name: 'Food & Dining', category: 'Shopping & Delivery', keywords: ['coffee', 'food', 'restaurant', 'cafe', 'delivery'] },
  { id: 'Car', name: 'Ride & Transport', category: 'Shopping & Delivery', keywords: ['car', 'uber', 'pathao', 'ride', 'travel', 'transport'] },
  { id: 'Plane', name: 'Travel & Airlines', category: 'Shopping & Delivery', keywords: ['plane', 'flight', 'travel', 'hotel', 'booking'] },

  // News & Reading
  { id: 'BookOpen', name: 'Books & Articles', category: 'News & Reading', keywords: ['book', 'reading', 'kindle', 'medium', 'article', 'library'] },
  { id: 'Newspaper', name: 'News & Press', category: 'News & Reading', keywords: ['newspaper', 'press', 'nytimes', 'journal', 'times', 'news'] },

  // Finance & Banking
  { id: 'CreditCard', name: 'Credit & Bank Card', category: 'Other', keywords: ['card', 'credit', 'bank', 'payment', 'visa', 'mastercard'] },
  { id: 'Wallet', name: 'Digital Wallet', category: 'Other', keywords: ['wallet', 'money', 'bkash', 'nagad', 'paypal', 'apple pay'] },
  { id: 'DollarSign', name: 'Finance & Money', category: 'Other', keywords: ['dollar', 'taka', 'money', 'cash', 'finance', 'invest'] },
  { id: 'Coins', name: 'Coins & Crypto', category: 'Other', keywords: ['coins', 'crypto', 'savings', 'taka', 'currency'] },
];

export const CATEGORY_DEFAULT_ICONS: Record<SubscriptionCategory, string> = {
  Streaming: 'Tv',
  Software: 'Code',
  Productivity: 'Zap',
  'Cloud & Hosting': 'Cloud',
  Gaming: 'Gamepad2',
  'Health & Fitness': 'Dumbbell',
  Utilities: 'Wifi',
  'News & Reading': 'BookOpen',
  'Shopping & Delivery': 'ShoppingBag',
  'Business & SaaS': 'Shield',
  Other: 'CreditCard',
};
