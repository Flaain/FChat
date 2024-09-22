export type Listeners = Map<keyof GlobalEventHandlersEventMap, Set<(event: any) => void>>

export interface IEventsContext {
    listeners: Map<any, any>;
    addEventListener<E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void): () => void;
}