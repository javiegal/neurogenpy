/**
 * Sigma.js Touch Captor
 * ======================
 *
 * Sigma's captor dealing with touch.
 * @module
 */
import { CameraState, Coordinates, Dimensions, TouchCoords } from "../../types";
import Captor from "./captor";
import Sigma from "../../sigma";
/**
 * Event types.
 */
export declare type TouchCaptorEvents = {
    touchdown(coordinates: TouchCoords): void;
    touchup(coordinates: TouchCoords): void;
    touchmove(coordinates: TouchCoords): void;
};
/**
 * Touch captor class.
 *
 * @constructor
 */
export default class TouchCaptor extends Captor<TouchCaptorEvents> {
    enabled: boolean;
    isMoving: boolean;
    startCameraState?: CameraState;
    touchMode: number;
    movingTimeout?: number;
    startTouchesAngle?: number;
    startTouchesDistance?: number;
    startTouchesPositions?: Coordinates[];
    lastTouchesPositions?: Coordinates[];
    constructor(container: HTMLElement, renderer: Sigma);
    kill(): void;
    getDimensions(): Dimensions;
    dispatchRelatedMouseEvent(type: string, e: TouchEvent, position?: Coordinates, emitter?: EventTarget): void;
    handleStart(e: TouchEvent): void;
    handleLeave(e: TouchEvent): void;
    handleMove(e: TouchEvent): void;
}
