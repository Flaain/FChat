export type Listeners = Map<keyof GlobalEventHandlersEventMap, Set<(event: GlobalEventHandlersEventMap[keyof GlobalEventHandlersEventMap]) => void>>

export interface DomEventsContextProps {
    addEventListener<E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void): () => void;
    removeEventListener<E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void): void;
}