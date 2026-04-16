'use client';

import {
  Children,
  ReactNode,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '@/components/common/button';
import { ui } from '@/lib/ui';
import { cn } from '@/lib/utils';

export type AdaptiveBoardLayout = {
  id: string;
  title: string;
  caption?: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  minColSpan?: number;
  minRowSpan?: number;
};

type ResizeHandle = 'right' | 'bottom' | 'corner';

type Interaction =
  | {
      mode: 'drag';
      id: string;
      startX: number;
      startY: number;
      origin: AdaptiveBoardLayout;
    }
  | {
      mode: 'resize';
      handle: ResizeHandle;
      id: string;
      startX: number;
      startY: number;
      origin: AdaptiveBoardLayout;
    }
  | null;

type AdaptiveBoardProps = {
  layouts: AdaptiveBoardLayout[];
  children: ReactNode;
  className?: string;
  storageKey?: string;
};

const DESKTOP_QUERY = '(min-width: 900px)';
const GRID_COLUMNS = 12;
const GRID_GAP = 12;
const ROW_HEIGHT = 94;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function overlaps(a: AdaptiveBoardLayout, b: AdaptiveBoardLayout) {
  return (
    a.col < b.col + b.colSpan &&
    a.col + a.colSpan > b.col &&
    a.row < b.row + b.rowSpan &&
    a.row + a.rowSpan > b.row
  );
}

function isValidLayout(items: AdaptiveBoardLayout[]) {
  return items.every((item, index) =>
    items.every((other, otherIndex) => {
      if (index === otherIndex) return true;
      return !overlaps(item, other);
    }),
  );
}

function getMetrics(boardWidth: number) {
  const cellWidth = (boardWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  return {
    cellWidth,
    stepX: cellWidth + GRID_GAP,
    stepY: ROW_HEIGHT + GRID_GAP,
  };
}

function getPanelStyle(item: AdaptiveBoardLayout, boardWidth: number) {
  const { cellWidth, stepX, stepY } = getMetrics(boardWidth);

  return {
    height: item.rowSpan * ROW_HEIGHT + (item.rowSpan - 1) * GRID_GAP,
    left: item.col * stepX,
    top: item.row * stepY,
    width: item.colSpan * cellWidth + (item.colSpan - 1) * GRID_GAP,
  };
}

function getBoardHeight(items: AdaptiveBoardLayout[]) {
  const contentRows = items.reduce((max, item) => Math.max(max, item.row + item.rowSpan), 0);

  return Math.max(640, contentRows * ROW_HEIGHT + Math.max(0, contentRows - 1) * GRID_GAP + 16);
}

export function AdaptiveBoard({ layouts, children, className, storageKey }: AdaptiveBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const childItems = Children.toArray(children);
  const [isDesktop, setIsDesktop] = useState(false);
  const [boardWidth, setBoardWidth] = useState(1180);
  const [items, setItems] = useState(layouts);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(!storageKey);
  const [interaction, setInteraction] = useState<Interaction>(null);

  useEffect(() => {
    setItems(layouts);
  }, [layouts]);

  useEffect(() => {
    if (!storageKey) return;

    try {
      const savedValue = window.localStorage.getItem(storageKey);
      if (!savedValue) {
        setHasLoadedStorage(true);
        return;
      }

      const parsed = JSON.parse(savedValue) as AdaptiveBoardLayout[];
      if (!Array.isArray(parsed)) {
        setHasLoadedStorage(true);
        return;
      }

      setItems(layouts.map((layout) => parsed.find((item) => item.id === layout.id) ?? layout));
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHasLoadedStorage(true);
    }
  }, [layouts, storageKey]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const sync = () => {
      setIsDesktop(mediaQuery.matches);
      setBoardWidth(boardRef.current?.clientWidth ?? 1180);
    };

    sync();
    mediaQuery.addEventListener('change', sync);
    window.addEventListener('resize', sync);

    return () => {
      mediaQuery.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  useEffect(() => {
    if (!storageKey || !hasLoadedStorage) return;

    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hasLoadedStorage, items, storageKey]);

  useEffect(() => {
    if (!interaction) return;

    function handleMove(event: PointerEvent) {
      const { stepX, stepY } = getMetrics(boardRef.current?.clientWidth ?? boardWidth);
      const colDelta = Math.round((event.clientX - interaction.startX) / stepX);
      const rowDelta = Math.round((event.clientY - interaction.startY) / stepY);

      setItems((currentItems) => {
        const nextItems = currentItems.map((item) => {
          if (item.id !== interaction.id) return item;

          if (interaction.mode === 'drag') {
            return {
              ...item,
              col: clamp(interaction.origin.col + colDelta, 0, GRID_COLUMNS - item.colSpan),
              row: Math.max(0, interaction.origin.row + rowDelta),
            };
          }

          return {
            ...item,
            colSpan:
              interaction.handle === 'bottom'
                ? interaction.origin.colSpan
                : clamp(
                    interaction.origin.colSpan + colDelta,
                    item.minColSpan ?? 2,
                    GRID_COLUMNS - interaction.origin.col,
                  ),
            rowSpan:
              interaction.handle === 'right'
                ? interaction.origin.rowSpan
                : Math.max(item.minRowSpan ?? 2, interaction.origin.rowSpan + rowDelta),
          };
        });

        return isValidLayout(nextItems) ? nextItems : currentItems;
      });
    }

    function stopInteraction() {
      setInteraction(null);
    }

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', stopInteraction);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', stopInteraction);
    };
  }, [boardWidth, interaction]);

  function startResize(
    event: ReactPointerEvent<HTMLButtonElement>,
    item: AdaptiveBoardLayout,
    handle: ResizeHandle,
  ) {
    if (!isDesktop) return;
    event.preventDefault();
    event.stopPropagation();
    setInteraction({
      mode: 'resize',
      handle,
      id: item.id,
      startX: event.clientX,
      startY: event.clientY,
      origin: item,
    });
  }

  function resetLayout() {
    setItems(layouts);
    if (storageKey) {
      window.localStorage.removeItem(storageKey);
    }
  }

  return (
    <div className="adaptive-board-shell">
      {storageKey ? (
        <div className="adaptive-board__toolbar">
          <span className="muted-copy">레이아웃을 저장하고 다시 불러옵니다.</span>
          <Button type="button" className="adaptive-board__reset" onClick={resetLayout}>
            레이아웃 초기화
          </Button>
        </div>
      ) : null}
      <div
        ref={boardRef}
        className={cn('adaptive-board', className)}
        style={isDesktop ? { minHeight: getBoardHeight(items) } : undefined}
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            className={cn(ui.card, 'adaptive-panel')}
            style={isDesktop ? getPanelStyle(item, boardWidth) : undefined}
          >
            <header
              className="adaptive-panel__header"
              onPointerDown={(event) => {
                if (!isDesktop) return;
                setInteraction({
                  mode: 'drag',
                  id: item.id,
                  startX: event.clientX,
                  startY: event.clientY,
                  origin: item,
                });
              }}
            >
              <div>
                <p className="adaptive-panel__title">{item.title}</p>
                {item.caption ? <p className="adaptive-panel__caption">{item.caption}</p> : null}
              </div>
              {isDesktop ? <span className="adaptive-panel__drag-label">드래그</span> : null}
            </header>
            <div className="adaptive-panel__content">{childItems[index]}</div>
            <button
              aria-label={`${item.title} 오른쪽 크기 조절`}
              className="adaptive-panel__resize adaptive-panel__resize--right"
              type="button"
              onPointerDown={(event) => startResize(event, item, 'right')}
            />
            <button
              aria-label={`${item.title} 하단 크기 조절`}
              className="adaptive-panel__resize adaptive-panel__resize--bottom"
              type="button"
              onPointerDown={(event) => startResize(event, item, 'bottom')}
            />
            <button
              aria-label={`${item.title} 우하단 크기 조절`}
              className="adaptive-panel__resize adaptive-panel__resize--corner"
              type="button"
              onPointerDown={(event) => startResize(event, item, 'corner')}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
