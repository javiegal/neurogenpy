/// <reference types="node" />
/**
 * Sigma.js Types
 * ===============
 *
 * Various type declarations used throughout the library.
 * @module
 */
import { EventEmitter } from "events";
/**
 * Util type to represent maps of typed elements, but implemented with
 * JavaScript objects.
 */
export declare type PlainObject<T = any> = {
    [k: string]: T;
};
/**
 * Returns a type similar to T, but with the the K set of properties of the type
 * T *required*, and the rest optional.
 */
export declare type PartialButFor<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>> & {
    [others: string]: any;
};
export interface Coordinates {
    x: number;
    y: number;
}
export interface CameraState extends Coordinates {
    angle: number;
    ratio: number;
}
export declare type MouseInteraction = "click" | "doubleClick" | "rightClick" | "wheel" | "down";
export interface MouseCoords extends Coordinates {
    sigmaDefaultPrevented: boolean;
    preventSigmaDefault(): void;
    original: MouseEvent;
}
export interface WheelCoords extends MouseCoords {
    delta: number;
}
export interface TouchCoords {
    touches: Coordinates[];
    original: TouchEvent;
}
export interface Dimensions {
    width: number;
    height: number;
}
export declare type Extent = [number, number];
export interface DisplayData {
    label: string | null;
    size: number;
    color: string;
    hidden: boolean;
    forceLabel: boolean;
    zIndex: number;
    type: string;
}
export interface NodeDisplayData extends Coordinates, DisplayData {
    highlighted: boolean;
}
export interface EdgeDisplayData extends DisplayData {
}
export declare type CoordinateConversionOverride = {
    cameraState?: CameraState;
    matrix?: Float32Array;
    viewportDimensions?: Dimensions;
    graphDimensions?: Dimensions;
    padding?: number;
};
/**
 * Custom event emitter types.
 */
export declare type Listener = (...args: any[]) => void;
export declare type EventsMapping = Record<string, Listener>;
interface ITypedEventEmitter<Events extends EventsMapping> {
    rawEmitter: EventEmitter;
    eventNames<Event extends keyof Events>(): Array<Event>;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    emit<Event extends keyof Events>(type: Event, ...args: Parameters<Events[Event]>): boolean;
    addListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
    on<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
    once<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
    prependListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
    prependOnceListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
    removeListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
    off<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
    removeAllListeners<Event extends keyof Events>(type?: Event): this;
    listeners<Event extends keyof Events>(type: Event): Events[Event][];
    listenerCount<Event extends keyof Events>(type: Event): number;
    rawListeners<Event extends keyof Events>(type: Event): Events[Event][];
}
declare const TypedEventEmitter_base: new <T extends EventsMapping>() => ITypedEventEmitter<T>;
export declare class TypedEventEmitter<Events extends EventsMapping> extends TypedEventEmitter_base<Events> {
    constructor();
}
export {};
