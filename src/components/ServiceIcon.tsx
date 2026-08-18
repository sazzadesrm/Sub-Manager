import React from 'react';
import {
  Tv,
  Film,
  Video,
  Music,
  Radio,
  Headphones,
  Code,
  Terminal,
  FolderGit2,
  Cpu,
  Layers,
  Shield,
  Bot,
  Sparkles,
  Layout,
  Palette,
  Zap,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Briefcase,
  Cloud,
  Database,
  Server,
  HardDrive,
  Globe,
  Gamepad2,
  Gamepad,
  Trophy,
  Dumbbell,
  Heart,
  Activity,
  Wifi,
  Home,
  Smartphone,
  ShoppingBag,
  Coffee,
  Car,
  Plane,
  BookOpen,
  Newspaper,
  CreditCard,
  Wallet,
  DollarSign,
  Coins,
  Apple,
  Tag,
  Compass,
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  category?: string;
  iconName?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ICON_COMPONENTS: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  Tv,
  Film,
  Video,
  Music,
  Radio,
  Headphones,
  Code,
  Terminal,
  FolderGit2,
  Cpu,
  Layers,
  Shield,
  Bot,
  Sparkles,
  Layout,
  Palette,
  Zap,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Briefcase,
  Cloud,
  Database,
  Server,
  HardDrive,
  Globe,
  Gamepad2,
  Gamepad,
  Trophy,
  Dumbbell,
  Heart,
  Activity,
  Wifi,
  Home,
  Smartphone,
  ShoppingBag,
  Coffee,
  Car,
  Plane,
  BookOpen,
  Newspaper,
  CreditCard,
  Wallet,
  DollarSign,
  Coins,
  Apple,
  Tag,
  Compass,
};

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
    // 1. Direct Lucide iconName match
    if (iconName && ICON_COMPONENTS[iconName]) {
      const CustomIcon = ICON_COMPONENTS[iconName];
      return <CustomIcon size={currentIconSize} />;
    }

    // 2. Case-insensitive key match
    if (iconName) {
      const foundKey = Object.keys(ICON_COMPONENTS).find(
        k => k.toLowerCase() === iconName.toLowerCase()
      );
      if (foundKey && ICON_COMPONENTS[foundKey]) {
        const CustomIcon = ICON_COMPONENTS[foundKey];
        return <CustomIcon size={currentIconSize} />;
      }
    }

    // 3. Service name keywords
    const lower = (name || '').toLowerCase();
    if (lower.includes('netflix') || lower.includes('hulu') || lower.includes('disney') || lower.includes('hbo')) {
      return <Tv size={currentIconSize} />;
    }
    if (lower.includes('chorki') || lower.includes('hoichoi') || lower.includes('cinema') || lower.includes('movie')) {
      return <Film size={currentIconSize} />;
    }
    if (lower.includes('spotify') || lower.includes('tidal') || lower.includes('music') || lower.includes('pandora')) {
      return <Music size={currentIconSize} />;
    }
    if (lower.includes('chatgpt') || lower.includes('openai') || lower.includes('claude') || lower.includes('gemini')) {
      return <Bot size={currentIconSize} />;
    }
    if (lower.includes('github') || lower.includes('gitlab') || lower.includes('copilot') || lower.includes('replit')) {
      return <Code size={currentIconSize} />;
    }
    if (lower.includes('figma') || lower.includes('sketch') || lower.includes('canva')) {
      return <Layout size={currentIconSize} />;
    }
    if (lower.includes('amazon') || lower.includes('prime') || lower.includes('walmart')) {
      return <ShoppingBag size={currentIconSize} />;
    }
    if (lower.includes('google') || lower.includes('drive') || lower.includes('dropbox') || lower.includes('icloud') || lower.includes('aws')) {
      return <Cloud size={currentIconSize} />;
    }
    if (lower.includes('apple')) {
      return <Apple size={currentIconSize} />;
    }
    if (lower.includes('adobe') || lower.includes('photoshop')) {
      return <Palette size={currentIconSize} />;
    }
    if (lower.includes('midjourney') || lower.includes('runway') || lower.includes('ai')) {
      return <Sparkles size={currentIconSize} />;
    }
    if (lower.includes('youtube') || lower.includes('twitch')) {
      return <Video size={currentIconSize} />;
    }
    if (lower.includes('playstation') || lower.includes('xbox') || lower.includes('nintendo') || lower.includes('steam')) {
      return <Gamepad2 size={currentIconSize} />;
    }
    if (lower.includes('gym') || lower.includes('fitness') || lower.includes('strava') || lower.includes('whoop')) {
      return <Dumbbell size={currentIconSize} />;
    }
    if (lower.includes('internet') || lower.includes('fiber') || lower.includes('wifi') || lower.includes('broadband')) {
      return <Wifi size={currentIconSize} />;
    }
    if (lower.includes('times') || lower.includes('journal') || lower.includes('medium') || lower.includes('news')) {
      return <BookOpen size={currentIconSize} />;
    }

    // 4. Category defaults
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
      className={`rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs transition-transform ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
      title={iconName || name}
    >
      {renderIcon()}
    </div>
  );
};
