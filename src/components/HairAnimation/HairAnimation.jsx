import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HairAnimation.css';

gsap.registerPlugin(ScrollTrigger);

const HairAnimation = ({ theme }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // WebGL Support Check
    try {
      const canvas = document.createElement('canvas');
      const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      if (!support) setIsSupported(false);
    } catch (e) { setIsSupported(false); }
  }, []);

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
    if (!isSupported) return;
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;position:absolute;top:0;left:0;';
    container.appendChild(canvas);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: false });
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = theme === 'light' ? 1.0 : 1.6;
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
    cameraRef.current = camera;

    // ... (rest of the scene setup: Lights, Bottle, Hair, Particles)
    // LIGHTS
    const ambient = new THREE.AmbientLight(0x1a0a05, 1.5);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xffd580, 4.5, 12);
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

    const bottleGroup = new THREE.Group();
    scene.add(bottleGroup);

    const bottlePoints = [];
    const profile = [[0.0, -2.2], [0.32, -2.2], [0.38, -2.0], [0.42, -1.5], [0.44, -0.8], [0.44, 0.2], [0.42, 0.9], [0.38, 1.3], [0.28, 1.55], [0.18, 1.72], [0.16, 1.9], [0.18, 2.1], [0.2, 2.2]];
    profile.forEach(([r, y]) => bottlePoints.push(new THREE.Vector2(r, y)));
    const bottleGeo = new THREE.LatheGeometry(bottlePoints, 64);
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffe8b0, metalness: 0, roughness: 0.05, transmission: 0.85, thickness: 0.5, ior: 1.52, transparent: true, opacity: 0.7, side: THREE.DoubleSide, emissive: 0xffe8b0, emissiveIntensity: 0.05 });
    const bottleMesh = new THREE.Mesh(bottleGeo, glassMat);
    bottleGroup.add(bottleMesh);

    const liquidPoints = [];
    const liquidP = [[0.0, -2.1], [0.28, -2.1], [0.33, -1.9], [0.36, -1.4], [0.37, -0.7], [0.37, 0.2], [0.35, 0.9], [0.28, 1.3], [0.12, 1.5]];
    liquidP.forEach(([r, y]) => liquidPoints.push(new THREE.Vector2(r, y)));
    const liquidGeo = new THREE.LatheGeometry(liquidPoints, 48);
    const liquidMat = new THREE.MeshStandardMaterial({ color: 0xd4900a, emissive: 0x3a2000, emissiveIntensity: 0.6, transparent: true, opacity: 0.55, roughness: 0, metalness: 0 });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    bottleGroup.add(liquidMesh);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af64, metalness: 1, roughness: 0.15 });
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.19, 0.5, 32), goldMat);
    cap.position.y = 2.45;
    bottleGroup.add(cap);

    const hairGroup = new THREE.Group();
    scene.add(hairGroup);
    const hairColors = [0x4a1a00, 0x6b2d08, 0x3d1200, 0x7a3510, 0x5c2206];
    for (let i = 0; i < 28; i++) {
      const baseAngle = (i / 28) * Math.PI * 2;
      const points = [];
      for (let s = 0; s <= 40; s++) {
        const t = s / 40;
        const y = 3.2 * (1 - 2 * t);
        const hairR = 0.15 + 0.42 * Math.sin(Math.max(0, Math.min(1, (t - 0.05) / 0.9)) * Math.PI) + (0.12 + 0.18 * Math.sin(t * Math.PI));
        const twist = baseAngle + (i % 2 === 0 ? 1 : -1) * t * Math.PI * 1.5 + Math.sin(t * Math.PI * 3 + i) * 0.15;
        points.push(new THREE.Vector3(Math.cos(twist) * hairR, y, Math.sin(twist) * hairR));
      }
      const strand = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, 0.008, 5, false), new THREE.MeshStandardMaterial({ color: hairColors[i % 5], metalness: 0.25, roughness: 0.4, emissive: new THREE.Color(hairColors[i % 5]).multiplyScalar(0.25) }));
      hairGroup.add(strand);
    }

    const pMat = new THREE.PointsMaterial({ color: 0xd4af64, size: 0.04, sizeAttenuation: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const r = 0.8 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pPos[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // GSAP Scroll Animation
    gsap.to(camera.position, {
      scrollTrigger: {
        trigger: 'body',
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
      z: 3.5,
      y: 0.8,
      ease: "power2.inOut"
    });

    gsap.to(bottleGroup.rotation, {
      scrollTrigger: {
        trigger: 'body',
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
      y: "+=6.28", // Full 360 turn
      ease: "none"
    });

    let mxRaw = 0, myRaw = 0;
    let baseTargetX = W > 768 ? -1.2 : 0;
    let targetX = baseTargetX, targetY = 0;
    const onMouse = (e) => { mxRaw = (e.clientX / W - 0.5) * 2; myRaw = -(e.clientY / H - 0.5) * 2; };
    window.addEventListener('mousemove', onMouse);

    const clock = new THREE.Clock();
    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      targetX += (baseTargetX + mxRaw * 0.4 - targetX) * 0.05;
      targetY += (myRaw * 0.2 - targetY) * 0.05;
      camera.position.x += (targetX - camera.position.x) * 0.05; // Influence du parallax sur la camera positionnée par scroll
      camera.lookAt(0, 0.2, 0);
      bottleGroup.rotation.y += 0.005;
      hairGroup.rotation.y = t * 0.18;
      pMat.opacity = 0.55 + Math.sin(t * 1.5) * 0.15;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H); baseTargetX = W > 768 ? -1.2 : 0;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (canvas.parentNode) canvas.remove();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isSupported]);

  if (!isSupported) {
    return (
      <div className="hair-animation-fallback">
        <div className="fallback-gradient"></div>
      </div>
    );
  }

  return <div ref={containerRef} className="hair-animation-bg" />;
};

export default HairAnimation;
