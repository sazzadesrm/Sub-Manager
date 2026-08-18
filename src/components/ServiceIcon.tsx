import React from 'react';
import {
  Tv,
  Music,
  Bot,
  Code,
  Layout,
  ShoppingBag,
  Cloud,
  Apple,
  Palette,
  Sparkles,
  Video,
  Gamepad2,
  Dumbbell,
  Wifi,
  BookOpen,
  CreditCard,
  Zap,
  Globe,
  Film,
  FolderGit2
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  category?: string;
  iconName?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  name,
  category,
  iconName,
  color = '#6366F1',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 24,
    xl: 32,
  };

  const currentIconSize = iconSizes[size];

  // Helper to render icon component by name or fallback by category
  const renderIcon = () => {
    const lower = (name || '').toLowerCase();
    const key = (iconName || '').toLowerCase();

    if (key === 'tv' || lower.includes('netflix') || lower.includes('hulu') || lower.includes('disney') || lower.includes('hbo')) {
      return <Tv size={currentIconSize} />;
    }
    if (key === 'music' || lower.includes('spotify') || lower.includes('tidal') || lower.includes('pandora')) {
      return <Music size={currentIconSize} />;
    }
    if (key === 'bot' || lower.includes('chatgpt') || lower.includes('openai') || lower.includes('claude') || lower.includes('gemini')) {
      return <Bot size={currentIconSize} />;
    }
    if (key === 'code' || lower.includes('github') || lower.includes('gitlab') || lower.includes('copilot') || lower.includes('replit')) {
      return <Code size={currentIconSize} />;
    }
    if (key === 'layout' || lower.includes('figma') || lower.includes('sketch') || lower.includes('canva')) {
      return <Layout size={currentIconSize} />;
    }
    if (key === 'shoppingbag' || lower.includes('amazon') || lower.includes('prime') || lower.includes('walmart')) {
      return <ShoppingBag size={currentIconSize} />;
    }
    if (key === 'cloud' || lower.includes('google one') || lower.includes('dropbox') || lower.includes('icloud') || lower.includes('aws')) {
      return <Cloud size={currentIconSize} />;
    }
    if (key === 'apple' || lower.includes('apple')) {
      return <Apple size={currentIconSize} />;
    }
    if (key === 'palette' || lower.includes('adobe') || lower.includes('creative cloud')) {
      return <Palette size={currentIconSize} />;
    }
    if (key === 'sparkles' || lower.includes('midjourney') || lower.includes('runway')) {
      return <Sparkles size={currentIconSize} />;
    }
    if (key === 'video' || lower.includes('youtube') || lower.includes('twitch')) {
      return <Video size={currentIconSize} />;
    }
    if (key === 'gamepad2' || lower.includes('playstation') || lower.includes('xbox') || lower.includes('nintendo') || lower.includes('steam')) {
      return <Gamepad2 size={currentIconSize} />;
    }
    if (key === 'dumbbell' || lower.includes('gym') || lower.includes('fitness') || lower.includes('strava') || lower.includes('whoop')) {
      return <Dumbbell size={currentIconSize} />;
    }
    if (key === 'wifi' || lower.includes('internet') || lower.includes('fiber') || lower.includes('verizon') || lower.includes('at&t')) {
      return <Wifi size={currentIconSize} />;
    }
    if (key === 'bookopen' || lower.includes('times') || lower.includes('journal') || lower.includes('medium') || lower.includes('kindle')) {
      return <BookOpen size={currentIconSize} />;
    }

    // Category fallbacks
    switch (category) {
      case 'Streaming':
        return <Film size={currentIconSize} />;
      case 'Software':
        return <Code size={currentIconSize} />;
      case 'Productivity':
        return <Zap size={currentIconSize} />;
      case 'Cloud & Hosting':
        return <Cloud size={currentIconSize} />;
      case 'Gaming':
        return <Gamepad2 size={currentIconSize} />;
      case 'Health & Fitness':
        return <Dumbbell size={currentIconSize} />;
      case 'Utilities':
        return <Wifi size={currentIconSize} />;
      case 'News & Reading':
        return <BookOpen size={currentIconSize} />;
      case 'Shopping & Delivery':
        return <ShoppingBag size={currentIconSize} />;
      default:
        return <CreditCard size={currentIconSize} />;
    }
  };

  return (
    <div
      className={`rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm transition-transform ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {renderIcon()}
    </div>
  );
};
