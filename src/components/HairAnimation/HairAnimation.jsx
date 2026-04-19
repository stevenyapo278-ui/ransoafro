import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './HairAnimation.css';

const HairAnimation = ({ theme }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // Si la scène est instanciée et que le thème change, on modifie le background et le fog
    if (sceneRef.current) {
      const bgColor = theme === 'light' ? 0xfdfbf7 : 0x050508;
      sceneRef.current.background.setHex(bgColor);
      sceneRef.current.fog.color.setHex(bgColor);

      // Ajustement dynamique de l'exposition pour ne pas aveugler en mode clair
      if (rendererRef.current) {
        rendererRef.current.toneMappingExposure = theme === 'light' ? 1.0 : 1.6;
      }
    }
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;position:absolute;top:0;left:0;';
    container.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding; // r128 API !
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = theme === 'light' ? 1.0 : 1.6; // Boost de l'exposition initiale en mode sombre
    rendererRef.current = renderer;
    
    let W = window.innerWidth;
    let H = window.innerHeight;
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialBgColor = theme === 'light' ? 0xfdfbf7 : 0x050508;
    scene.background = new THREE.Color(initialBgColor);
    scene.fog = new THREE.FogExp2(initialBgColor, 0.08);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0.5, 6);
    camera.lookAt(0, 0, 0);

    // LIGHTS
    const ambient = new THREE.AmbientLight(0x1a0a05, 1.5); // Boost ambient (0.8 -> 1.5)
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xffd580, 4.5, 12); // Boost key light (3.5 -> 4.5)
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x4060aa, 1.8, 10);
    fillLight.position.set(-4, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight(0xc084fc, 2.5, 15, Math.PI / 6, 0.5);
    rimLight.position.set(-2, 5, -3);
    scene.add(rimLight);

    const bottomLight = new THREE.PointLight(0xd4af64, 1.2, 8);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);

    // BOTTLE GROUP (TEXTUEL)
    const bottleGroup = new THREE.Group();
    scene.add(bottleGroup);

    const bottlePoints = [];
    const profile = [
      [0.0, -2.2], [0.32, -2.2], [0.38, -2.0], [0.42, -1.5],
      [0.44, -0.8], [0.44, 0.2], [0.42, 0.9], [0.38, 1.3],
      [0.28, 1.55], [0.18, 1.72], [0.16, 1.9], [0.18, 2.1],
      [0.2, 2.2]
    ];
    profile.forEach(([r, y]) => bottlePoints.push(new THREE.Vector2(r, y)));

    const bottleGeo = new THREE.LatheGeometry(bottlePoints, 64);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffe8b0,
      metalness: 0.0,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.5,
      ior: 1.52,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      emissive: 0xffe8b0,
      emissiveIntensity: 0.05 // Très légère lueur pour la bouteille
    });
    const bottleMesh = new THREE.Mesh(bottleGeo, glassMat);
    bottleGroup.add(bottleMesh);

    // Inner liquid
    const liquidPoints = [];
    const liquidP = [
      [0.0, -2.1], [0.28, -2.1], [0.33, -1.9], [0.36, -1.4],
      [0.37, -0.7], [0.37, 0.2], [0.35, 0.9], [0.28, 1.3], [0.12, 1.5]
    ];
    liquidP.forEach(([r, y]) => liquidPoints.push(new THREE.Vector2(r, y)));
    const liquidGeo = new THREE.LatheGeometry(liquidPoints, 48);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xd4900a, emissive: 0x3a2000, emissiveIntensity: 0.6, // Boost emissive du liquide
      transparent: true, opacity: 0.55, roughness: 0.0, metalness: 0.0
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    bottleGroup.add(liquidMesh);

    // Gold cap
    const capGeo = new THREE.CylinderGeometry(0.22, 0.19, 0.5, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af64, metalness: 1.0, roughness: 0.15
    });
    const cap = new THREE.Mesh(capGeo, goldMat);
    cap.position.y = 2.45;
    bottleGroup.add(cap);

    // Cap top disc
    const capTopGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 32);
    const capTop = new THREE.Mesh(capTopGeo, goldMat);
    capTop.position.y = 2.72;
    bottleGroup.add(capTop);

    // Thin gold ring at bottle neck
    const ringGeo = new THREE.TorusGeometry(0.2, 0.015, 8, 48);
    const ring = new THREE.Mesh(ringGeo, goldMat);
    ring.position.y = 2.2;
    ring.rotation.x = Math.PI / 2;
    bottleGroup.add(ring);

    // Bottom base disc
    const baseGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 32);
    const base = new THREE.Mesh(baseGeo, goldMat);
    base.position.y = -2.24;
    bottleGroup.add(base);

    // HAIR STRANDS (TEXTUEL)
    const hairGroup = new THREE.Group();
    scene.add(hairGroup);

    const STRAND_COUNT = 28;
    const hairColors = [0x4a1a00, 0x6b2d08, 0x3d1200, 0x7a3510, 0x5c2206];

    for (let i = 0; i < STRAND_COUNT; i++) {
      const baseAngle = (i / STRAND_COUNT) * Math.PI * 2;
      const colorIdx = i % hairColors.length;
      const direction = i % 2 === 0 ? 1 : -1;
      const points = [];
      const segs = 40;

      for (let s = 0; s <= segs; s++) {
        const t = s / segs;
        const y = 3.2 * (1 - 2 * t);
        const bottleR = 0.15 + 0.42 * Math.sin(Math.max(0, Math.min(1, (t - 0.05) / 0.9)) * Math.PI);
        const spread = 0.12 + 0.18 * Math.sin(t * Math.PI);
        const hairR = bottleR + spread;
        const twist = baseAngle + direction * t * Math.PI * 1.5 + Math.sin(t * Math.PI * 3 + i) * 0.15;
        const wobble = Math.sin(t * Math.PI * 4 + i * 0.7) * 0.04;
        points.push(new THREE.Vector3(
          Math.cos(twist) * (hairR + wobble),
          y,
          Math.sin(twist) * (hairR + wobble)
        ));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const thickness = 0.006 + Math.random() * 0.004;
      const tubeGeo = new THREE.TubeGeometry(curve, 48, thickness, 5, false);

      const hairMat = new THREE.MeshStandardMaterial({
        color: hairColors[colorIdx],
        metalness: 0.25, // Rendu un peu plus métallique
        roughness: 0.4,
        emissive: new THREE.Color(hairColors[colorIdx]).multiplyScalar(0.25), // Lueur augmentée (0.08 -> 0.25)
      });
      const strand = new THREE.Mesh(tubeGeo, hairMat);
      hairGroup.add(strand);
    }

    // GOLD SHIMMER PARTICLES (TEXTUEL)
    const particleCount = 600;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);
    const pPhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 0.8 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pPositions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pPositions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
      pSizes[i] = 1.5 + Math.random() * 3;
      pPhases[i] = Math.random() * Math.PI * 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

    const pMat = new THREE.PointsMaterial({
      color: 0xd4af64,
      size: 0.04,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // MOUSE PARALLAX & CAMERA OFFSET
    let mxRaw = 0, myRaw = 0;
    let baseTargetX = window.innerWidth > 768 ? -1.2 : 0;
    let targetX = baseTargetX, targetY = 0;
    const onMouse = (e) => {
      mxRaw = (e.clientX / W - 0.5) * 2;
      myRaw = -(e.clientY / H - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // ANIMATION
    const clock = new THREE.Clock();
    let raf;

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth camera parallax with base offset
      targetX += (baseTargetX + mxRaw * 0.4 - targetX) * 0.05;
      targetY += (myRaw * 0.2 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = 0.5 + targetY * 0.5;
      camera.lookAt(0, 0.2, 0);

      // Bottle slow rotation
      bottleGroup.rotation.y = t * 0.25;

      // Hair group rotates slightly faster for parallax
      hairGroup.rotation.y = t * 0.18;

      // Subtle bottle breathing
      const breathe = 1 + Math.sin(t * 0.8) * 0.012;
      bottleGroup.scale.set(breathe, 1, breathe);

      // Particles drift
      particles.rotation.y = t * 0.06;
      particles.rotation.x = Math.sin(t * 0.12) * 0.05;

      // Animate particle opacity/shimmer
      pMat.opacity = 0.55 + Math.sin(t * 1.5) * 0.15;

      // Key light orbits slowly
      keyLight.position.x = 3 * Math.cos(t * 0.3);
      keyLight.position.z = 3 * Math.sin(t * 0.3);

      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      baseTargetX = W > 768 ? -1.2 : 0;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (canvas.parentNode) canvas.remove();
    };
  }, []); // Remove theme dependency here so we don't restart WebGL unnessessarily

  return <div ref={containerRef} className="hair-animation-bg" />;
};

export default HairAnimation;
