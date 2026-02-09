import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * AppShell wrapper component for consistent page layout
 * Provides proper spacing and structure for main content area
 */
export function AppShell({ children, className = '' }: AppShellProps) {
  return (
    <div className={`flex-1 flex flex-col min-h-screen ${className}`}>
      {/* Main content wrapper */}
      <main className="flex-1 p-6 lg:p-8 bg-background">
        <div className="max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * Page header component for consistent page titles and actions
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  actions,
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Content section component for organizing page content
 */
interface ContentSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ContentSection({ 
  title, 
  description, 
  children,
  className = '' 
}: ContentSectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-xl font-semibold text-foreground mb-1">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Grid layout component for responsive layouts
 */
interface GridLayoutProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 4 | 6 | 8;
  className?: string;
}

export function GridLayout({ 
  children, 
  cols = 3,
  gap = 6,
  className = '' 
}: GridLayoutProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols];

  const gapClass = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  }[gap];

  return (
    <div className={`grid ${colsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}
