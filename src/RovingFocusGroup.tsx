"use client";

import * as React from "react";
import { useCallback, useRef, createContext, useContext, useMemo } from "react";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { Primitive } from "@radix-ui/react-primitive";

/* -------------------------------------------------------------------------------------------------
 * RovingFocusGroup
 * -----------------------------------------------------------------------------------------------*/

type Direction = "horizontal" | "vertical" | "both";

type RovingFocusGroupContextValue = {
  /**
   * The current focus direction
   */
  direction: Direction;
  
  /**
   * Function to register a focusable item in the group
   */
  registerItem: (
    id: string, 
    ref: React.RefObject<HTMLElement>, 
    disabled?: boolean
  ) => () => void;
  
  /**
   * Function called when an item is focused
   */
  onItemFocus: (id: string) => void;
  
  /**
   * The currently focused item id
   */
  currentFocusedId: string | null;
};

// Export the context for external use
export const RovingFocusGroupContext = createContext<RovingFocusGroupContextValue | null>(null);

export function useRovingFocusContext() {
  const context = useContext(RovingFocusGroupContext);
  if (!context) {
    throw new Error("RovingFocusGroupItem must be used within RovingFocusGroup");
  }
  return context;
}

// Safe version that doesn't throw
export function useSafeRovingFocusContext() {
  return useContext(RovingFocusGroupContext);
}

interface RovingFocusGroupProps {
  direction?: Direction;
  loop?: boolean;
  children: React.ReactNode;
  asChild?: boolean;
  orientation?: Direction; // alias for direction
  defaultFocus?: string;
}

const Root = React.forwardRef<HTMLDivElement, RovingFocusGroupProps>(
  (props, forwardedRef) => {
    const {
      children,
      direction: directionProp = "horizontal",
      loop = true,
      orientation,
      defaultFocus,
      asChild,
      ...groupProps
    } = props;

    // Allow 'orientation' as an alias for 'direction'
    const direction = orientation || directionProp;
    
    // Track registered items
    const itemsRef = useRef<Map<string, { ref: React.RefObject<HTMLElement>, disabled: boolean }>>(new Map());
    const [currentFocusedId, setCurrentFocusedId] = React.useState<string | null>(defaultFocus || null);
    
    // Register a focusable item
    const registerItem = useCallbackRef((id: string, ref: React.RefObject<HTMLElement>, disabled = false) => {
      itemsRef.current.set(id, { ref, disabled });
      return () => {
        itemsRef.current.delete(id);
        if (currentFocusedId === id) {
          setCurrentFocusedId(null);
        }
      };
    });
    
    // Handle item focus
    const onItemFocus = useCallbackRef((id: string) => {
      setCurrentFocusedId(id);
    });
    
    // Handle keyboard navigation
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        return;
      }
      
      // Don't handle if modifier keys are pressed
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }
      
      const items = Array.from(itemsRef.current.entries())
        .filter(([_, { disabled }]) => !disabled)
        .map(([id, { ref }]) => ({ id, ref }));
      
      if (items.length === 0) return;
      
      const currentIndex = currentFocusedId 
        ? items.findIndex(item => item.id === currentFocusedId) 
        : -1;
        
      let nextIndex: number | undefined;
      
      switch (event.key) {
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = items.length - 1;
          break;
        case 'ArrowUp':
          if (direction === 'vertical' || direction === 'both') {
            event.preventDefault();
            if (currentIndex === -1) {
              nextIndex = 0;
            } else if (currentIndex > 0) {
              nextIndex = currentIndex - 1;
            } else if (loop) {
              nextIndex = items.length - 1;
            }
          }
          break;
        case 'ArrowDown':
          if (direction === 'vertical' || direction === 'both') {
            event.preventDefault();
            if (currentIndex === -1) {
              nextIndex = 0;
            } else if (currentIndex < items.length - 1) {
              nextIndex = currentIndex + 1;
            } else if (loop) {
              nextIndex = 0;
            }
          }
          break;
        case 'ArrowLeft':
          if (direction === 'horizontal' || direction === 'both') {
            event.preventDefault();
            if (currentIndex === -1) {
              nextIndex = 0;
            } else if (currentIndex > 0) {
              nextIndex = currentIndex - 1;
            } else if (loop) {
              nextIndex = items.length - 1;
            }
          }
          break;
        case 'ArrowRight':
          if (direction === 'horizontal' || direction === 'both') {
            event.preventDefault();
            if (currentIndex === -1) {
              nextIndex = 0;
            } else if (currentIndex < items.length - 1) {
              nextIndex = currentIndex + 1;
            } else if (loop) {
              nextIndex = 0;
            }
          }
          break;
      }
      
      if (nextIndex !== undefined && nextIndex >= 0 && nextIndex < items.length) {
        const nextItem = items[nextIndex];
        if (nextItem?.ref.current) {
          nextItem.ref.current.focus();
          setCurrentFocusedId(nextItem.id);
        }
      }
    }, [currentFocusedId, direction, loop]);
    
    // Create the context value
    const contextValue = useMemo(() => ({
      direction,
      registerItem,
      onItemFocus,
      currentFocusedId,
    }), [direction, registerItem, onItemFocus, currentFocusedId]);

    const Comp = asChild ? Primitive.div : 'div';
    
    return (
      <RovingFocusGroupContext.Provider value={contextValue}>
        <Comp
          {...groupProps}
          ref={forwardedRef}
          role="group"
          onKeyDown={handleKeyDown}
        >
          {children}
        </Comp>
      </RovingFocusGroupContext.Provider>
    );
  }
);

Root.displayName = "RovingFocusGroup";

/* -------------------------------------------------------------------------------------------------
 * RovingFocusGroupItem
 * -----------------------------------------------------------------------------------------------*/

interface RovingFocusGroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  focusable?: boolean;
  disabled?: boolean;
  tabStopId?: string;
  asChild?: boolean;
  children: React.ReactNode;
}

// Regular component for when context is available
const RegularItem = React.forwardRef<HTMLDivElement, RovingFocusGroupItemProps & { context: RovingFocusGroupContextValue }>(
  (props, forwardedRef) => {
    const {
      id: propId,
      disabled = false,
      focusable = true,
      tabStopId,
      asChild,
      context,
      ...itemProps
    } = props;
    
    // Generate a unique ID if none is provided
    const [internalId] = React.useState(() => propId || `roving-focus-${Math.random().toString(36).substring(2, 9)}`);
    const id = propId || internalId;
    
    const ref = useRef<HTMLDivElement>(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    
    // Register this item with the group
    React.useEffect(() => {
      if (!disabled && focusable && context) {
        return context.registerItem(id, ref, disabled);
      }
      return undefined;
    }, [context, id, disabled, focusable, context.registerItem]);
    
    // Handle focus event
    const handleFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
      if (event.target === ref.current && context) {
        context.onItemFocus(id);
      }
      if (itemProps.onFocus) {
        itemProps.onFocus(event);
      }
    }, [context, id, itemProps]);

    const isFocused = context ? context.currentFocusedId === id : false;
    const isCurrentTabStop = tabStopId ? tabStopId === context?.currentFocusedId : isFocused;

    const Comp = asChild ? Primitive.div : 'div';
    
    return (
      <Comp
        {...itemProps}
        ref={composedRefs}
        role="group"
        data-orientation={context?.direction}
        data-focused={isFocused ? "" : undefined}
        tabIndex={!disabled && focusable && isCurrentTabStop ? 0 : -1}
        onFocus={handleFocus}
        aria-disabled={disabled || undefined}
      />
    );
  }
);

RegularItem.displayName = "RegularRovingFocusGroupItem";

// Fallback component for when context is not available
const FallbackItem = React.forwardRef<HTMLDivElement, RovingFocusGroupItemProps>(
  (props, forwardedRef) => {
    const { asChild, children, ...itemProps } = props;
    const Comp = asChild ? Primitive.div : 'div';
    return <Comp {...itemProps} ref={forwardedRef}>{children}</Comp>;
  }
);

FallbackItem.displayName = "FallbackRovingFocusGroupItem";

// Main item component that decides which implementation to use
const Item = React.forwardRef<HTMLDivElement, RovingFocusGroupItemProps>(
  (props, forwardedRef) => {
    // Always call hooks at the top level, regardless of conditions
    const context = useSafeRovingFocusContext();
    
    if (!context) {
      return <FallbackItem {...props} ref={forwardedRef} />;
    }
    
    return <RegularItem {...props} context={context} ref={forwardedRef} />;
  }
);

Item.displayName = "RovingFocusGroupItem";

// Create a backward-compatible alias
const RovingFocusGroup = Root;
const RovingFocusGroupItem = Item;

export {
  RovingFocusGroup,
  RovingFocusGroupItem,
  // Also export with the new names for better compatibility
  Root,
  Item
};