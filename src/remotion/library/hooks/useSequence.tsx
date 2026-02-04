import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Scene definition for sequencing animations.
 */
export interface SequenceScene {
  /** Unique identifier for this scene */
  id: string;
  /** Start time in seconds */
  at: number;
  /** Duration in seconds */
  duration: number;
  /** Optional label for GSAP timeline positioning */
  label?: string;
}

/**
 * Beat marker for single-moment events in the sequence.
 */
export interface SequenceBeat {
  /** Unique identifier for this beat */
  id: string;
  /** Time in seconds when the beat occurs */
  at: number;
}

/**
 * Hook return type for useSequence.
 */
export interface UseSequenceReturn {
  /** The GSAP timeline instance */
  timeline: gsap.core.Timeline | null;
  /** Add a scene to the sequence */
  addScene: (scene: SequenceScene) => void;
  /** Add a beat marker */
  addBeat: (beat: SequenceBeat) => void;
  /** Get the current time in seconds */
  currentTime: number;
  /** Check if a scene is currently active */
  isSceneActive: (sceneId: string) => boolean;
  /** Get the progress of a scene (0-1) */
  getSceneProgress: (sceneId: string) => number;
  /** Total duration of the sequence */
  totalDuration: number;
}

/**
 * Hook to orchestrate multiple animations with labeled scenes and beats.
 * Integrates with Remotion's frame-based system.
 *
 * @example
 * const { timeline, addScene, isSceneActive, getSceneProgress } = useSequence();
 *
 * // Define scenes
 * addScene({ id: 'intro', at: 0, duration: 1 });
 * addScene({ id: 'main', at: 1, duration: 2 });
 *
 * // Check if scene is active
 * if (isSceneActive('intro')) {
 *   // Render intro content
 * }
 *
 * // Get scene progress for animations
 * const progress = getSceneProgress('main'); // 0-1
 */
export function useSequence(): UseSequenceReturn {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scenesRef = useRef<Map<string, SequenceScene>>(new Map());
  const beatsRef = useRef<Map<string, SequenceBeat>>(new Map());

  // Current time in seconds
  const currentTime = frame / fps;

  // Initialize timeline
  useEffect(() => {
    timelineRef.current = gsap.timeline({ paused: true });
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  // Sync timeline with frame
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.seek(currentTime);
    }
  }, [currentTime]);

  // Add a scene to the sequence
  const addScene = useCallback((scene: SequenceScene) => {
    scenesRef.current.set(scene.id, scene);
    if (timelineRef.current && scene.label) {
      timelineRef.current.addLabel(scene.label, scene.at);
    }
  }, []);

  // Add a beat marker
  const addBeat = useCallback((beat: SequenceBeat) => {
    beatsRef.current.set(beat.id, beat);
    if (timelineRef.current) {
      timelineRef.current.addLabel(`beat-${beat.id}`, beat.at);
    }
  }, []);

  // Check if a scene is currently active
  const isSceneActive = useCallback(
    (sceneId: string): boolean => {
      const scene = scenesRef.current.get(sceneId);
      if (!scene) return false;
      return currentTime >= scene.at && currentTime < scene.at + scene.duration;
    },
    [currentTime],
  );

  // Get the progress of a scene (0-1)
  const getSceneProgress = useCallback(
    (sceneId: string): number => {
      const scene = scenesRef.current.get(sceneId);
      if (!scene) return 0;

      if (currentTime < scene.at) return 0;
      if (currentTime >= scene.at + scene.duration) return 1;

      return (currentTime - scene.at) / scene.duration;
    },
    [currentTime],
  );

  // Calculate total duration from all scenes
  const totalDuration = Array.from(scenesRef.current.values()).reduce(
    (max, scene) => Math.max(max, scene.at + scene.duration),
    0,
  );

  return {
    timeline: timelineRef.current,
    addScene,
    addBeat,
    currentTime,
    isSceneActive,
    getSceneProgress,
    totalDuration,
  };
}
