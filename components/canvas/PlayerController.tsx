'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { GirlAvatar, GirlAvatarRefs } from './GirlAvatar';

interface PlayerControllerProps {
  onMove?: (
    position: [number, number, number],
    rotation: [number, number, number],
    action: 'idle' | 'walking' | 'jumping'
  ) => void;
  joystickInput?: { x: number; y: number };
  isTouchDevice?: boolean;
  cameraMode?: 'first-person' | 'third-person';
  onToggleCameraMode?: () => void;
  myColor?: string;
  myName?: string;
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  onMove,
  joystickInput = { x: 0, y: 0 },
  isTouchDevice = false,
  cameraMode = 'third-person',
  onToggleCameraMode,
  myColor = '#f472b6', // Default Pink for Girl character
  myName = 'You',
}) => {
  const { camera, gl } = useThree();

  const girlRef = useRef<GirlAvatarRefs>(null);
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3(0, 0, 6)); // Ground contact level
  const yaw = useRef(0);
  const pitch = useRef(0.12);
  const isJumping = useRef(false);
  const verticalVelocity = useRef(0);
  const lastEmitTime = useRef(0);
  const isLocked = useRef(false);
  const walkCycle = useRef(0);
  const characterTargetYaw = useRef(0);

  // Initialize camera
  useEffect(() => {
    camera.rotation.order = 'YXZ';
  }, [camera]);

  // Robust Keyboard Event Listeners (supports both e.code and e.key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.key) {
        keys.current[e.key.toLowerCase()] = true;
      }

      // Space key for Jump
      if ((e.code === 'Space' || e.key === ' ') && !isJumping.current) {
        isJumping.current = true;
        verticalVelocity.current = 6.2;
      }

      // V key for camera mode toggle
      if ((e.code === 'KeyV' || e.key?.toLowerCase() === 'v') && onToggleCameraMode) {
        onToggleCameraMode();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      if (e.key) {
        keys.current[e.key.toLowerCase()] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onToggleCameraMode]);

  // Desktop Pointer Lock mouse look
  useEffect(() => {
    const dom = gl.domElement;

    const onPointerLockChange = () => {
      isLocked.current = document.pointerLockElement === dom;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      const sensitivity = 0.0022;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;

      // Clamp vertical camera angle
      pitch.current = Math.max(-Math.PI / 4, Math.min(Math.PI / 3, pitch.current));
    };

    const onClick = () => {
      if (!isTouchDevice && !isLocked.current) {
        dom.requestPointerLock?.();
      }
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('mousemove', onMouseMove);
    dom.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      dom.removeEventListener('click', onClick);
    };
  }, [gl, isTouchDevice]);

  // Touch drag camera rotation for mobile
  useEffect(() => {
    if (!isTouchDevice) return;

    let touchStartX = 0;
    let touchStartY = 0;
    const dom = gl.domElement;

    const onTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.clientX > window.innerWidth / 2) {
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
          break;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.clientX > window.innerWidth / 2) {
          const deltaX = touch.clientX - touchStartX;
          const deltaY = touch.clientY - touchStartY;
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;

          const sensitivity = 0.004;
          yaw.current -= deltaX * sensitivity;
          pitch.current -= deltaY * sensitivity;
          pitch.current = Math.max(-Math.PI / 4, Math.min(Math.PI / 3, pitch.current));
          break;
        }
      }
    };

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
    };
  }, [gl, isTouchDevice]);

  // Main 60 FPS Physics & Animation Loop
  useFrame((state, delta) => {
    // 1. Check A, W, S, D input (robust mapping)
    const isW = !!(keys.current['KeyW'] || keys.current['w'] || keys.current['ArrowUp']);
    const isS = !!(keys.current['KeyS'] || keys.current['s'] || keys.current['ArrowDown']);
    const isA = !!(keys.current['KeyA'] || keys.current['a'] || keys.current['ArrowLeft']);
    const isD = !!(keys.current['KeyD'] || keys.current['d'] || keys.current['ArrowRight']);

    let moveForward = 0;
    let moveRight = 0;

    if (isW) moveForward += 1;
    if (isS) moveForward -= 1;
    if (isA) moveRight -= 1;
    if (isD) moveRight += 1;

    // Mobile Joystick
    if (joystickInput.y !== 0) moveForward += joystickInput.y;
    if (joystickInput.x !== 0) moveRight += joystickInput.x;

    const isMoving = Math.abs(moveForward) > 0.05 || Math.abs(moveRight) > 0.05;

    // 2. Compute Velocity relative to Camera Yaw
    const speed = 4.8;
    const direction = new THREE.Vector3(moveRight, 0, -moveForward);
    if (direction.lengthSq() > 1) {
      direction.normalize();
    }

    if (isMoving) {
      // Direct angle relative to camera view:
      // Pressing W (moveForward=1, moveRight=0): atan2(0,1) = 0 => faces straight forward into room
      const inputAngle = Math.atan2(moveRight, moveForward);
      characterTargetYaw.current = yaw.current + Math.PI + inputAngle;
    }

    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    velocity.current.x = direction.x * speed;
    velocity.current.z = direction.z * speed;

    // 3. Jump Physics & Gravity
    if (isJumping.current) {
      verticalVelocity.current -= 18.0 * delta;
      position.current.y += verticalVelocity.current * delta;

      if (position.current.y <= 0) {
        position.current.y = 0;
        isJumping.current = false;
        verticalVelocity.current = 0;
      }
    }

    // 4. Update Position & Clamp Room Bounds
    position.current.x += velocity.current.x * delta;
    position.current.z += velocity.current.z * delta;

    const ROOM_BOUND = 10.2;
    position.current.x = Math.max(-ROOM_BOUND, Math.min(ROOM_BOUND, position.current.x));
    position.current.z = Math.max(-ROOM_BOUND, Math.min(ROOM_BOUND, position.current.z));

    // 5. Update Camera Position according to Camera Mode
    if (cameraMode === 'third-person') {
      const camDistance = 3.3;
      const camHeight = 1.7;
      const offsetX = Math.sin(yaw.current) * camDistance * Math.cos(pitch.current);
      const offsetZ = Math.cos(yaw.current) * camDistance * Math.cos(pitch.current);
      const offsetY = camHeight + Math.sin(pitch.current) * camDistance;

      camera.position.set(
        position.current.x + offsetX,
        position.current.y + offsetY,
        position.current.z + offsetZ
      );
      camera.lookAt(position.current.x, position.current.y + 1.2, position.current.z);
    } else {
      camera.position.set(position.current.x, position.current.y + 1.6, position.current.z);
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;
    }

    // 6. Direct Frame-Perfect Character Animation on Girl Avatar
    const girl = girlRef.current;
    if (girl && girl.group) {
      // Direct position sync
      girl.group.position.set(position.current.x, position.current.y, position.current.z);

      // Smooth rotation to face walking direction
      if (isMoving) {
        let diff = characterTargetYaw.current - girl.group.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        girl.group.rotation.y += diff * Math.min(1, delta * 15);
      } else {
        // Idle faces forward relative to camera
        const targetIdleYaw = yaw.current + Math.PI;
        let diff = targetIdleYaw - girl.group.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        girl.group.rotation.y += diff * Math.min(1, delta * 8);
      }

      const time = state.clock.elapsedTime;

      if (isJumping.current) {
        // JUMPING ANIMATION: Arms held high in celebration, legs tucked
        if (girl.leftArm) girl.leftArm.rotation.x = -Math.PI * 0.7;
        if (girl.rightArm) girl.rightArm.rotation.x = -Math.PI * 0.7;
        if (girl.leftLeg) girl.leftLeg.rotation.x = 0.45;
        if (girl.rightLeg) girl.rightLeg.rotation.x = 0.45;
        if (girl.bodyRoot) girl.bodyRoot.position.y = 0.12;
      } else if (isMoving) {
        // WALKING ANIMATION: In step with A, W, S, D
        walkCycle.current += delta * 11;
        const swing = Math.sin(walkCycle.current) * 0.55;

        if (girl.leftLeg) girl.leftLeg.rotation.x = swing;
        if (girl.rightLeg) girl.rightLeg.rotation.x = -swing;

        if (girl.leftArm) girl.leftArm.rotation.x = -swing * 0.85;
        if (girl.rightArm) girl.rightArm.rotation.x = swing * 0.85;

        if (girl.bodyRoot) {
          girl.bodyRoot.position.y = Math.abs(Math.sin(walkCycle.current)) * 0.07;
        }
        if (girl.head) {
          girl.head.rotation.y = Math.sin(walkCycle.current * 0.5) * 0.05;
        }
      } else {
        // IDLE ANIMATION: Gentle relaxed breathing
        const breath = Math.sin(time * 2.5) * 0.03;
        if (girl.leftLeg) girl.leftLeg.rotation.x = 0;
        if (girl.rightLeg) girl.rightLeg.rotation.x = 0;
        if (girl.leftArm) girl.leftArm.rotation.x = breath;
        if (girl.rightArm) girl.rightArm.rotation.x = -breath;
        if (girl.bodyRoot) girl.bodyRoot.position.y = breath * 0.5;
        if (girl.head) girl.head.rotation.y = Math.sin(time * 0.8) * 0.04;
      }
    }

    // 7. Broadcast position delta at 25Hz to multiplayer peers
    const now = Date.now();
    if (onMove && now - lastEmitTime.current > 40) {
      lastEmitTime.current = now;
      const action = isJumping.current ? 'jumping' : isMoving ? 'walking' : 'idle';
      onMove(
        [position.current.x, position.current.y, position.current.z],
        [pitch.current, yaw.current, 0],
        action
      );
    }
  });

  return (
    <>
      {/* GIRL CHARACTER (YOU) IN THIRD PERSON MODE */}
      {cameraMode === 'third-person' && (
        <GirlAvatar
          ref={girlRef}
          name={`${myName} (You)`}
          pinkColor={myColor}
        />
      )}
    </>
  );
};
