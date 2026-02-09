import { useState, DragEvent } from 'react';
import { GripVerticalIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LeasingFunnelStage, LeadCard } from '@/types';

interface KanbanBoardProps {
  stages: LeasingFunnelStage[];
  onCardMove: (cardId: string, fromStage: string, toStage: string) => void;
  onCardClick?: (card: LeadCard) => void;
  renderCard?: (card: LeadCard) => React.ReactNode;
  className?: string;
}

/**
 * Drag-and-drop kanban board for leasing funnel
 */
export function KanbanBoard({ 
  stages, 
  onCardMove, 
  onCardClick,
  renderCard,
  className = '' 
}: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = useState<{
    card: LeadCard;
    stageId: string;
  } | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  /**
   * Handle drag start
   */
  const handleDragStart = (card: LeadCard, stageId: string) => (e: DragEvent) => {
    setDraggedCard({ card, stageId });
    e.dataTransfer.effectAllowed = 'move';
  };

  /**
   * Handle drag over
   */
  const handleDragOver = (stageId: string) => (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stageId);
  };

  /**
   * Handle drag leave
   */
  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  /**
   * Handle drop
   */
  const handleDrop = (toStageId: string) => (e: DragEvent) => {
    e.preventDefault();
    
    if (draggedCard && draggedCard.stageId !== toStageId) {
      onCardMove(draggedCard.card.id, draggedCard.stageId, toStageId);
    }
    
    setDraggedCard(null);
    setDragOverStage(null);
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverStage(null);
  };

  /**
   * Default card renderer
   */
  const defaultRenderCard = (card: LeadCard) => (
    <div className="p-3 bg-background border border-border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-foreground">{card.name}</h4>
        <GripVerticalIcon className="w-4 h-4 text-muted-foreground cursor-grab" />
      </div>
      <p className="text-xs text-muted-foreground mb-2">{card.unit}</p>
      {card.time && (
        <p className="text-xs text-muted-foreground">{card.time}</p>
      )}
      {card.channel && (
        <div className="mt-2">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
            {card.channel}
          </span>
        </div>
      )}
      {card.score !== undefined && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${card.score}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground">{card.score}</span>
          </div>
        </div>
      )}
    </div>
  );

  const cardRenderer = renderCard || defaultRenderCard;

  return (
    <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
      {stages.map(stage => (
        <div 
          key={stage.id}
          className="flex-shrink-0 w-80"
        >
          <Card className="bg-card border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{stage.name}</h3>
                <span className="text-sm text-muted-foreground">
                  {stage.cards.length}
                </span>
              </div>
            </div>
            
            <div 
              className={`p-3 min-h-[400px] space-y-3 ${
                dragOverStage === stage.id ? 'bg-accent/50' : ''
              }`}
              onDragOver={handleDragOver(stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop(stage.id)}
            >
              {stage.cards.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  Drop cards here
                </div>
              ) : (
                stage.cards.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={handleDragStart(card, stage.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onCardClick?.(card)}
                    className={`cursor-pointer transition-opacity ${
                      draggedCard?.card.id === card.id ? 'opacity-50' : ''
                    }`}
                  >
                    {cardRenderer(card)}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
