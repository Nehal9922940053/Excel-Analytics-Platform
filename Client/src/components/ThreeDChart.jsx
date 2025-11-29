
// import React, { useRef, useEffect } from 'react';
// import * as THREE from 'three';

// const ThreeDChart = ({ chartType, chartData, xAxis, yAxis, title }) => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);

//   useEffect(() => {
//     if (!mountRef.current || !chartData) return;

//     // Initialize Three.js scene
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf0f0f0);
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
//     camera.position.set(0, 5, 10);
//     camera.lookAt(0, 0, 0);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     rendererRef.current = renderer;

//     // Clear previous content
//     while (mountRef.current.firstChild) {
//       mountRef.current.removeChild(mountRef.current.firstChild);
//     }
//     mountRef.current.appendChild(renderer.domElement);

//     // Add lights
//     const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(10, 20, 5);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);

//     // Create chart based on type
//     create3DChart(scene, chartType, chartData, xAxis, yAxis);

//     // Animation
//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Handle resize
//     const handleResize = () => {
//       if (!mountRef.current) return;
//       camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//       }
//     };
//   }, [chartType, chartData, xAxis, yAxis]);

//   const create3DChart = (scene, chartType, chartData, xAxis, yAxis) => {
//     // Clear previous chart objects
//     while (scene.children.length > 2) { // Keep lights
//       scene.remove(scene.children[scene.children.length - 1]);
//     }

//     switch (chartType) {
//       case 'bar':
//         create3DBarChart(scene, chartData, xAxis, yAxis);
//         break;
//       case 'line':
//         create3DLineChart(scene, chartData, xAxis, yAxis);
//         break;
//       case 'pie':
//         create3DPieChart(scene, chartData, xAxis, yAxis);
//         break;
//       case 'scatter':
//         create3DScatterPlot(scene, chartData, xAxis, yAxis);
//         break;
//       default:
//         create3DBarChart(scene, chartData, xAxis, yAxis);
//     }
//   };

//   const create3DBarChart = (scene, chartData, xAxis, yAxis) => {
//     const labels = chartData.labels || [];
//     const values = chartData.datasets?.[0]?.data || [];
    
//     if (labels.length === 0 || values.length === 0) return;

//     const maxValue = Math.max(...values);
//     const barSpacing = 0.5;
//     const barWidth = 0.8;

//     labels.forEach((label, index) => {
//       const value = values[index];
//       const height = (value / maxValue) * 8;
//       const x = index * (barWidth + barSpacing) - (labels.length * (barWidth + barSpacing)) / 2;

//       // Create bar
//       const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
//       const material = new THREE.MeshPhongMaterial({
//         color: new THREE.Color(`hsl(${(index * 360) / labels.length}, 70%, 60%)`),
//         shininess: 100
//       });
//       const bar = new THREE.Mesh(geometry, material);
//       bar.position.set(x, height / 2, 0);
//       bar.castShadow = true;
//       scene.add(bar);

//       // Add value label
//       createTextLabel(`${value}`, x, height + 0.2, 0, scene);
//     });

//     // Add grid
//     const gridHelper = new THREE.GridHelper(10, 10, 0x000000, 0x000000);
//     gridHelper.position.y = -0.01;
//     scene.add(gridHelper);
//   };

//   const create3DLineChart = (scene, chartData, xAxis, yAxis) => {
//     const labels = chartData.labels || [];
//     const values = chartData.datasets?.[0]?.data || [];
    
//     if (labels.length === 0 || values.length === 0) return;

//     const maxValue = Math.max(...values);
//     const points = [];

//     labels.forEach((label, index) => {
//       const value = values[index];
//       const x = (index / (labels.length - 1)) * 8 - 4;
//       const y = (value / maxValue) * 6;
//       points.push(new THREE.Vector3(x, y, 0));
//     });

//     // Create line
//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//     const material = new THREE.LineBasicMaterial({ color: 0x2196f3, linewidth: 2 });
//     const line = new THREE.Line(geometry, material);
//     scene.add(line);

//     // Add points
//     points.forEach((point, index) => {
//       const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
//       const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff5722 });
//       const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//       sphere.position.copy(point);
//       scene.add(sphere);
//     });
//   };

//   const create3DPieChart = (scene, chartData, xAxis, yAxis) => {
//     const labels = chartData.labels || [];
//     const values = chartData.datasets?.[0]?.data || [];
    
//     if (labels.length === 0 || values.length === 0) return;

//     const total = values.reduce((sum, value) => sum + value, 0);
//     let currentAngle = 0;

//     values.forEach((value, index) => {
//       const angle = (value / total) * Math.PI * 2;
      
//       // Create pie slice
//       const geometry = new THREE.CylinderGeometry(3, 3, 1, 32, 1, false, currentAngle, angle);
//       const material = new THREE.MeshPhongMaterial({
//         color: new THREE.Color(`hsl(${(index * 360) / values.length}, 70%, 60%)`),
//         side: THREE.DoubleSide
//       });
//       const slice = new THREE.Mesh(geometry, material);
//       slice.rotation.x = Math.PI / 2;
//       scene.add(slice);

//       currentAngle += angle;
//     });
//   };

//   const create3DScatterPlot = (scene, chartData, xAxis, yAxis) => {
//     const points = chartData.datasets?.[0]?.data || [];
    
//     if (points.length === 0) return;

//     // Normalize data
//     const xValues = points.map(p => p.x);
//     const yValues = points.map(p => p.y);
//     const maxX = Math.max(...xValues);
//     const maxY = Math.max(...yValues);

//     points.forEach((point, index) => {
//       const x = (point.x / maxX) * 8 - 4;
//       const y = (point.y / maxY) * 6;

//       const geometry = new THREE.SphereGeometry(0.1, 16, 16);
//       const material = new THREE.MeshPhongMaterial({
//         color: new THREE.Color(`hsl(${(index * 360) / points.length}, 70%, 60%)`)
//       });
//       const sphere = new THREE.Mesh(geometry, material);
//       sphere.position.set(x, y, 0);
//       scene.add(sphere);
//     });

//     // Add grid
//     const gridHelper = new THREE.GridHelper(10, 10, 0x000000, 0x000000);
//     gridHelper.position.y = -0.01;
//     scene.add(gridHelper);
//   };

//   const createTextLabel = (text, x, y, z, scene) => {
//     // Simple text implementation - in a real app you might want to use a proper text geometry
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     canvas.width = 256;
//     canvas.height = 128;
//     context.fillStyle = '#000000';
//     context.font = '24px Arial';
//     context.fillText(text, 10, 50);

//     const texture = new THREE.CanvasTexture(canvas);
//     const material = new THREE.SpriteMaterial({ map: texture });
//     const sprite = new THREE.Sprite(material);
//     sprite.position.set(x, y, z);
//     sprite.scale.set(1, 0.5, 1);
//     scene.add(sprite);
//   };

//   return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
// };

// export default ThreeDChart;


// import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const ThreeDChart = forwardRef(({ chartType, chartData, xAxis, yAxis, title }, ref) => {
//     const containerRef = useRef(null);
//     const sceneRef = useRef(null);
//     const rendererRef = useRef(null);
//     const cameraRef = useRef(null);
//     const controlsRef = useRef(null);
//     const animationFrameRef = useRef(null);
//     const [isInteracting, setIsInteracting] = useState(false);

//     // Expose methods to parent component
//     useImperativeHandle(ref, () => ({
//         getCanvas: () => {
//             return rendererRef.current?.domElement;
//         },
//         captureImage: () => {
//             if (rendererRef.current) {
//                 return rendererRef.current.domElement.toDataURL('image/png');
//             }
//             return null;
//         }
//     }));

//     useEffect(() => {
//         if (!containerRef.current || !chartData) return;

//         // Scene setup
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xf8fafc);
//         scene.fog = new THREE.Fog(0xf8fafc, 30, 60);
//         sceneRef.current = scene;

//         // Camera setup
//         const camera = new THREE.PerspectiveCamera(
//             60,
//             containerRef.current.clientWidth / containerRef.current.clientHeight,
//             0.1,
//             1000
//         );
//         camera.position.set(20, 18, 20);
//         cameraRef.current = camera;

//         // Renderer setup
//         const renderer = new THREE.WebGLRenderer({
//             antialias: true,
//             preserveDrawingBuffer: true,
//             alpha: true
//         });
//         renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//         renderer.shadowMap.enabled = true;
//         renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//         containerRef.current.appendChild(renderer.domElement);
//         rendererRef.current = renderer;

//         // Controls - Enhanced for better user experience
//         const controls = new OrbitControls(camera, renderer.domElement);
        
//         // Enable all control types
//         controls.enableRotate = true;      // Enable rotation with left mouse button
//         controls.enableZoom = true;        // Enable zoom with mouse wheel
//         controls.enablePan = true;         // Enable pan with right mouse button
        
//         // Damping for smooth controls
//         controls.enableDamping = true;
//         controls.dampingFactor = 0.08;
        
//         // Speed settings
//         controls.rotateSpeed = 0.6;        // Left mouse drag rotation speed
//         controls.zoomSpeed = 1.2;          // Mouse wheel zoom speed
//         controls.panSpeed = 0.8;           // Right mouse drag pan speed
        
//         // Distance limits
//         controls.minDistance = 10;
//         controls.maxDistance = 50;
        
//         // Vertical rotation limit (prevent flipping upside down)
//         controls.maxPolarAngle = Math.PI / 2 + 0.2;
        
//         // Auto rotate settings (when not interacting)
//         controls.autoRotate = false;
//         controls.autoRotateSpeed = 2.0;
        
//         // Mouse buttons configuration
//         controls.mouseButtons = {
//             LEFT: THREE.MOUSE.ROTATE,      // Left button: Rotate
//             MIDDLE: THREE.MOUSE.DOLLY,     // Middle button: Zoom
//             RIGHT: THREE.MOUSE.PAN         // Right button: Pan
//         };
        
//         // Touch controls for mobile
//         controls.touches = {
//             ONE: THREE.TOUCH.ROTATE,       // One finger: Rotate
//             TWO: THREE.TOUCH.DOLLY_PAN     // Two fingers: Zoom and Pan
//         };
        
//         controlsRef.current = controls;

//         // Track interaction state
//         controls.addEventListener('start', () => setIsInteracting(true));
//         controls.addEventListener('end', () => setIsInteracting(false));

//         // Enhanced Lighting
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//         scene.add(ambientLight);

//         const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
//         directionalLight1.position.set(15, 20, 15);
//         directionalLight1.castShadow = true;
//         directionalLight1.shadow.mapSize.width = 2048;
//         directionalLight1.shadow.mapSize.height = 2048;
//         scene.add(directionalLight1);

//         const directionalLight2 = new THREE.DirectionalLight(0x6366f1, 0.3);
//         directionalLight2.position.set(-10, 10, -10);
//         scene.add(directionalLight2);

//         const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
//         scene.add(hemisphereLight);

//         // Ground plane with gradient
//         const groundGeometry = new THREE.PlaneGeometry(50, 50);
//         const groundMaterial = new THREE.MeshStandardMaterial({
//             color: 0xe2e8f0,
//             roughness: 0.8,
//             metalness: 0.2
//         });
//         const ground = new THREE.Mesh(groundGeometry, groundMaterial);
//         ground.rotation.x = -Math.PI / 2;
//         ground.position.y = 0;
//         ground.receiveShadow = true;
//         scene.add(ground);

//         // Enhanced grid
//         const gridHelper = new THREE.GridHelper(30, 30, 0x94a3b8, 0xcbd5e1);
//         gridHelper.position.y = 0.01;
//         scene.add(gridHelper);

//         // Axis helpers with labels
//         createAxisHelpers(scene);

//         // Create 3D visualization based on chart type
//         const chartGroup = new THREE.Group();
//         scene.add(chartGroup);

//         if (chartType === 'bar') {
//             createBarChart3D(chartGroup, chartData);
//         } else if (chartType === 'line') {
//             createLineChart3D(chartGroup, chartData);
//         } else if (chartType === 'pie') {
//             createPieChart3D(chartGroup, chartData);
//         } else if (chartType === 'scatter') {
//             createScatterChart3D(chartGroup, chartData);
//         }

//         // Add floating title
//         createFloatingTitle(scene, title || `${yAxis} by ${xAxis}`);

//         // Animation loop
//         const animate = () => {
//             animationFrameRef.current = requestAnimationFrame(animate);
            
//             // Smooth rotation when not interacting
//             if (!isInteracting && chartGroup) {
//                 chartGroup.rotation.y += 0.002;
//             }
            
//             controls.update();
//             renderer.render(scene, camera);
//         };
//         animate();

//         // Handle window resize
//         const handleResize = () => {
//             if (containerRef.current && camera && renderer) {
//                 const width = containerRef.current.clientWidth;
//                 const height = containerRef.current.clientHeight;
                
//                 camera.aspect = width / height;
//                 camera.updateProjectionMatrix();
//                 renderer.setSize(width, height);
//             }
//         };
        
//         window.addEventListener('resize', handleResize);

//         // Cleanup
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             if (animationFrameRef.current) {
//                 cancelAnimationFrame(animationFrameRef.current);
//             }
//             controls.dispose();
//             renderer.dispose();
//             if (containerRef.current && renderer.domElement) {
//                 containerRef.current.removeChild(renderer.domElement);
//             }
            
//             // Dispose geometries and materials
//             scene.traverse((object) => {
//                 if (object.geometry) object.geometry.dispose();
//                 if (object.material) {
//                     if (Array.isArray(object.material)) {
//                         object.material.forEach(material => material.dispose());
//                     } else {
//                         object.material.dispose();
//                     }
//                 }
//             });
//         };
//     }, [chartData, chartType, xAxis, yAxis, title, isInteracting]);

//     const createAxisHelpers = (scene) => {
//         const axisLength = 15;
        
//         // X Axis (Red)
//         const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
//             new THREE.Vector3(0, 0, 0),
//             new THREE.Vector3(axisLength, 0, 0)
//         ]);
//         const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
//         const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
//         scene.add(xAxis);

//         // Y Axis (Green)
//         const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
//             new THREE.Vector3(0, 0, 0),
//             new THREE.Vector3(0, axisLength, 0)
//         ]);
//         const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x22c55e, linewidth: 2 });
//         const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
//         scene.add(yAxis);

//         // Z Axis (Blue)
//         const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
//             new THREE.Vector3(0, 0, 0),
//             new THREE.Vector3(0, 0, axisLength)
//         ]);
//         const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });
//         const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
//         scene.add(zAxis);
//     };

//     const createFloatingTitle = (scene, text) => {
//         // Create a simple representation of title with a plane
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');
//         canvas.width = 512;
//         canvas.height = 128;
        
//         context.fillStyle = 'rgba(99, 102, 241, 0.1)';
//         context.fillRect(0, 0, canvas.width, canvas.height);
        
//         context.fillStyle = '#1e293b';
//         context.font = 'bold 32px Inter, Arial, sans-serif';
//         context.textAlign = 'center';
//         context.textBaseline = 'middle';
//         context.fillText(text, canvas.width / 2, canvas.height / 2);
        
//         const texture = new THREE.CanvasTexture(canvas);
//         const material = new THREE.MeshBasicMaterial({
//             map: texture,
//             transparent: true,
//             side: THREE.DoubleSide
//         });
//         const geometry = new THREE.PlaneGeometry(8, 2);
//         const titleMesh = new THREE.Mesh(geometry, material);
//         titleMesh.position.set(0, 16, 0);
//         scene.add(titleMesh);
//     };

//     const createBarChart3D = (parent, data) => {
//         const values = data.datasets[0].data;
//         const maxValue = Math.max(...values);
//         const barWidth = 0.6;
//         const spacing = 1.5;
//         const totalWidth = values.length * spacing;

//         values.forEach((value, index) => {
//             const height = (value / maxValue) * 12;
//             const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
            
//             const hue = (index / values.length) * 0.7;
//             const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            
//             const material = new THREE.MeshStandardMaterial({
//                 color: color,
//                 metalness: 0.3,
//                 roughness: 0.4,
//                 emissive: color,
//                 emissiveIntensity: 0.2
//             });
            
//             const bar = new THREE.Mesh(geometry, material);
//             bar.position.set(
//                 (index - values.length / 2) * spacing,
//                 height / 2,
//                 0
//             );
//             bar.castShadow = true;
//             bar.receiveShadow = true;
//             parent.add(bar);

//             // Add subtle edge glow
//             const edgesGeometry = new THREE.EdgesGeometry(geometry);
//             const edgesMaterial = new THREE.LineBasicMaterial({
//                 color: 0xffffff,
//                 transparent: true,
//                 opacity: 0.3
//             });
//             const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
//             edges.position.copy(bar.position);
//             parent.add(edges);

//             // Add glowing top cap
//             const capGeometry = new THREE.PlaneGeometry(barWidth, barWidth);
//             const capMaterial = new THREE.MeshBasicMaterial({
//                 color: color,
//                 transparent: true,
//                 opacity: 0.6
//             });
//             const cap = new THREE.Mesh(capGeometry, capMaterial);
//             cap.rotation.x = -Math.PI / 2;
//             cap.position.set(bar.position.x, height + 0.01, bar.position.z);
//             parent.add(cap);
//         });
//     };

//     const createLineChart3D = (parent, data) => {
//         const values = data.datasets[0].data;
//         const maxValue = Math.max(...values);
//         const spacing = 1.5;

//         const points = [];
//         const spheres = [];
        
//         values.forEach((value, index) => {
//             const height = (value / maxValue) * 12;
//             const point = new THREE.Vector3(
//                 (index - values.length / 2) * spacing,
//                 height,
//                 0
//             );
//             points.push(point);
//         });

//         // Create glowing tube line
//         const curve = new THREE.CatmullRomCurve3(points);
//         const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
//         const tubeMaterial = new THREE.MeshStandardMaterial({
//             color: 0x6366f1,
//             metalness: 0.5,
//             roughness: 0.3,
//             emissive: 0x6366f1,
//             emissiveIntensity: 0.4
//         });
//         const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
//         tube.castShadow = true;
//         parent.add(tube);

//         // Add glowing spheres at data points
//         points.forEach((point, index) => {
//             const sphereGeometry = new THREE.SphereGeometry(0.35, 32, 32);
//             const hue = (index / points.length) * 0.3 + 0.55;
//             const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            
//             const sphereMaterial = new THREE.MeshStandardMaterial({
//                 color: color,
//                 metalness: 0.4,
//                 roughness: 0.2,
//                 emissive: color,
//                 emissiveIntensity: 0.5
//             });
//             const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//             sphere.position.copy(point);
//             sphere.castShadow = true;
//             parent.add(sphere);

//             // Add glow effect
//             const glowGeometry = new THREE.SphereGeometry(0.45, 32, 32);
//             const glowMaterial = new THREE.MeshBasicMaterial({
//                 color: color,
//                 transparent: true,
//                 opacity: 0.3
//             });
//             const glow = new THREE.Mesh(glowGeometry, glowMaterial);
//             glow.position.copy(point);
//             parent.add(glow);
//         });
//     };

//     const createPieChart3D = (parent, data) => {
//         const values = data.datasets[0].data;
//         const total = values.reduce((a, b) => a + b, 0);
//         let currentAngle = 0;
//         const radius = 6;
//         const height = 3;
//         const explodeDistance = 0.5;

//         values.forEach((value, index) => {
//             const angle = (value / total) * Math.PI * 2;
//             const midAngle = currentAngle + angle / 2;
            
//             const geometry = new THREE.CylinderGeometry(
//                 radius,
//                 radius,
//                 height,
//                 32,
//                 1,
//                 false,
//                 currentAngle,
//                 angle
//             );
            
//             const hue = (index / values.length);
//             const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            
//             const material = new THREE.MeshStandardMaterial({
//                 color: color,
//                 metalness: 0.3,
//                 roughness: 0.4,
//                 emissive: color,
//                 emissiveIntensity: 0.3
//             });
            
//             const slice = new THREE.Mesh(geometry, material);
            
//             // Explode slice slightly
//             const explodeX = Math.cos(midAngle) * explodeDistance;
//             const explodeZ = Math.sin(midAngle) * explodeDistance;
            
//             slice.position.set(explodeX, height / 2, explodeZ);
//             slice.castShadow = true;
//             slice.receiveShadow = true;
//             parent.add(slice);

//             // Add edges
//             const edgesGeometry = new THREE.EdgesGeometry(geometry);
//             const edgesMaterial = new THREE.LineBasicMaterial({
//                 color: 0xffffff,
//                 transparent: true,
//                 opacity: 0.4
//             });
//             const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
//             edges.position.copy(slice.position);
//             parent.add(edges);

//             currentAngle += angle;
//         });
//     };

//     const createScatterChart3D = (parent, data) => {
//         const points = data.datasets[0].data;
//         const xValues = points.map(p => parseFloat(p.x) || 0);
//         const yValues = points.map(p => parseFloat(p.y) || 0);
        
//         const maxX = Math.max(...xValues);
//         const maxY = Math.max(...yValues);
//         const minX = Math.min(...xValues);
//         const minY = Math.min(...yValues);

//         points.forEach((point, index) => {
//             const x = ((parseFloat(point.x) - minX) / (maxX - minX || 1) - 0.5) * 20;
//             const y = ((parseFloat(point.y) - minY) / (maxY - minY || 1)) * 12;
//             const z = (Math.random() - 0.5) * 8;

//             const size = 0.3 + Math.random() * 0.2;
//             const geometry = new THREE.SphereGeometry(size, 32, 32);
            
//             const hue = (index / points.length) * 0.8;
//             const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            
//             const material = new THREE.MeshStandardMaterial({
//                 color: color,
//                 metalness: 0.4,
//                 roughness: 0.3,
//                 emissive: color,
//                 emissiveIntensity: 0.4
//             });
            
//             const sphere = new THREE.Mesh(geometry, material);
//             sphere.position.set(x, y, z);
//             sphere.castShadow = true;
//             parent.add(sphere);

//             // Add glow
//             const glowGeometry = new THREE.SphereGeometry(size + 0.1, 16, 16);
//             const glowMaterial = new THREE.MeshBasicMaterial({
//                 color: color,
//                 transparent: true,
//                 opacity: 0.2
//             });
//             const glow = new THREE.Mesh(glowGeometry, glowMaterial);
//             glow.position.copy(sphere.position);
//             parent.add(glow);
//         });
//     };

//     return (
//         <div className="relative w-full h-full">
//             <div ref={containerRef} className="w-full h-full" />
            
//             {/* Interaction Status Indicator */}
//             {isInteracting && (
//                 <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
//                     <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
//                     <span className="text-sm font-medium">Interacting</span>
//                 </div>
//             )}
            
//             {/* Control Instructions Overlay - Enhanced */}
//             <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-gradient-to-br from-white/95 to-indigo-50/95 backdrop-blur-md rounded-xl shadow-2xl p-4 border-2 border-indigo-200/50">
//                 <div className="flex flex-col gap-3">
//                     {/* Header */}
//                     <div className="flex items-center gap-3 pb-2 border-b border-indigo-200">
//                         <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                             <span className="text-white font-bold text-lg">3D</span>
//                         </div>
//                         <div>
//                             <span className="font-bold text-gray-800 text-sm sm:text-base">Interactive Controls</span>
//                             <p className="text-xs text-gray-600">Use mouse or touch to interact</p>
//                         </div>
//                     </div>
                    
//                     {/* Desktop Controls */}
//                     <div className="hidden sm:grid grid-cols-1 gap-2.5 text-xs">
//                         <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
//                             <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
//                                 </svg>
//                             </div>
//                             <div className="flex-1">
//                                 <span className="font-semibold text-gray-800">Left Click + Drag</span>
//                                 <p className="text-gray-600">Rotate the view</p>
//                             </div>
//                         </div>
                        
//                         <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
//                             <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                                 <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
//                                 </svg>
//                             </div>
//                             <div className="flex-1">
//                                 <span className="font-semibold text-gray-800">Mouse Wheel</span>
//                                 <p className="text-gray-600">Zoom in/out</p>
//                             </div>
//                         </div>
                        
//                         <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
//                             <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                                 <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
//                                 </svg>
//                             </div>
//                             <div className="flex-1">
//                                 <span className="font-semibold text-gray-800">Right Click + Drag</span>
//                                 <p className="text-gray-600">Pan the view</p>
//                             </div>
//                         </div>
//                     </div>
                    
//                     {/* Mobile/Touch Controls */}
//                     <div className="sm:hidden grid grid-cols-1 gap-2 text-xs">
//                         <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
//                             <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                                 <span className="text-blue-600 font-bold">1</span>
//                             </div>
//                             <div className="flex-1">
//                                 <span className="font-semibold text-gray-800">One Finger</span>
//                                 <p className="text-gray-600 text-xs">Drag to rotate</p>
//                             </div>
//                         </div>
                        
//                         <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
//                             <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                                 <span className="text-green-600 font-bold">2</span>
//                             </div>
//                             <div className="flex-1">
//                                 <span className="font-semibold text-gray-800">Two Fingers</span>
//                                 <p className="text-gray-600 text-xs">Pinch to zoom, drag to pan</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// });

// ThreeDChart.displayName = 'ThreeDChart';

// export default ThreeDChart;
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDChart = forwardRef(({ chartType, chartData, xAxis, yAxis, title }, ref) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const animationFrameRef = useRef(null);
    const chartGroupRef = useRef(null);
    
    const [isInitialized, setIsInitialized] = useState(false);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        getCanvas: () => {
            return rendererRef.current?.domElement;
        },
        captureImage: (highQuality = true) => {
            if (rendererRef.current) {
                const canvas = rendererRef.current.domElement;
                
                if (highQuality) {
                    // Create a high-resolution copy
                    const originalSize = {
                        width: canvas.width,
                        height: canvas.height
                    };
                    
                    // Temporarily increase resolution for capture
                    rendererRef.current.setSize(
                        originalSize.width * 2, 
                        originalSize.height * 2, 
                        false
                    );
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                    
                    // Capture high-res image
                    const dataURL = canvas.toDataURL('image/png');
                    
                    // Restore original size
                    rendererRef.current.setSize(
                        originalSize.width, 
                        originalSize.height, 
                        false
                    );
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                    
                    return dataURL;
                }
                
                return canvas.toDataURL('image/png');
            }
            return null;
        }
    }));

    // Prevent default touch behaviors that conflict with Three.js
    useEffect(() => {
        const preventDefault = (e) => {
            if (containerRef.current?.contains(e.target)) {
                e.preventDefault();
            }
        };

        const events = ['touchstart', 'touchmove', 'touchend', 'wheel'];
        events.forEach(event => {
            document.addEventListener(event, preventDefault, { passive: false });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, preventDefault);
            });
        };
    }, []);

    // Initialize Three.js scene - RUNS ONLY ONCE
    useEffect(() => {
        if (!containerRef.current || isInitialized) return;

        const initThreeJS = () => {
            try {
                // Scene setup
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xf8fafc);
                sceneRef.current = scene;

                // Get container dimensions
                const container = containerRef.current;
                const width = container.clientWidth;
                const height = container.clientHeight;

                // Camera setup
                const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
                camera.position.set(20, 18, 20);
                cameraRef.current = camera;

                // Renderer setup
                const renderer = new THREE.WebGLRenderer({ 
                    antialias: true,
                    preserveDrawingBuffer: true,
                    alpha: false,
                    powerPreference: "high-performance"
                });
                
                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                
                // Clear any existing canvas
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                container.appendChild(renderer.domElement);
                rendererRef.current = renderer;

                // OrbitControls - Disable auto rotation
                const controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.screenSpacePanning = false;
                controls.minDistance = 5;
                controls.maxDistance = 50;
                controls.maxPolarAngle = Math.PI;
                controls.autoRotate = false; // Explicitly disable auto rotation
                controlsRef.current = controls;

                // Lighting
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(15, 20, 15);
                directionalLight.castShadow = true;
                scene.add(directionalLight);

                // Ground
                const groundGeometry = new THREE.PlaneGeometry(50, 50);
                const groundMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0xe2e8f0,
                    roughness: 0.8
                });
                const ground = new THREE.Mesh(groundGeometry, groundMaterial);
                ground.rotation.x = -Math.PI / 2;
                ground.receiveShadow = true;
                scene.add(ground);

                // Grid
                const gridHelper = new THREE.GridHelper(30, 30, 0x94a3b8, 0xcbd5e1);
                gridHelper.position.y = 0.01;
                scene.add(gridHelper);

                setIsInitialized(true);

            } catch (error) {
                console.error('Error initializing 3D chart:', error);
            }
        };

        initThreeJS();

        // Handle window resize
        const handleResize = () => {
            if (containerRef.current && cameraRef.current && rendererRef.current) {
                const container = containerRef.current;
                const width = container.clientWidth;
                const height = container.clientHeight;

                cameraRef.current.aspect = width / height;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(width, height);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isInitialized]);

    // Update chart content when data changes - SEPARATE from initialization
    useEffect(() => {
        if (!isInitialized || !sceneRef.current || !chartData) return;

        const updateChart = () => {
            // Remove existing chart group
            if (chartGroupRef.current) {
                sceneRef.current.remove(chartGroupRef.current);
                // Dispose of geometries and materials
                chartGroupRef.current.traverse((child) => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            }

            // Create new chart group
            const chartGroup = new THREE.Group();
            chartGroupRef.current = chartGroup;
            sceneRef.current.add(chartGroup);

            if (chartType === 'bar') {
                createBarChart3D(chartGroup, chartData);
            } else if (chartType === 'line') {
                createLineChart3D(chartGroup, chartData);
            } else if (chartType === 'pie') {
                createPieChart3D(chartGroup, chartData);
            } else if (chartType === 'scatter') {
                createScatterChart3D(chartGroup, chartData);
            }
        };

        updateChart();
    }, [chartData, chartType, xAxis, yAxis, title, isInitialized]);

    // Animation loop - SEPARATE from other effects
    useEffect(() => {
        if (!isInitialized || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;

        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);
            
            // Only update controls - NO AUTO ROTATION
            if (controlsRef.current) {
                controlsRef.current.update();
            }
            
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        animate();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isInitialized]);

    // Comprehensive cleanup
    useEffect(() => {
        return () => {
            // Stop animation loop
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            // Dispose controls
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }

            // Dispose renderer
            if (rendererRef.current) {
                rendererRef.current.dispose();
                if (containerRef.current && rendererRef.current.domElement) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                }
            }

            // Dispose scene objects
            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }

            setIsInitialized(false);
        };
    }, []);

    // Chart creation functions - memoized to prevent recreations
    const createBarChart3D = useCallback((parent, data) => {
        const values = data.datasets[0].data;
        const maxValue = Math.max(...values);
        const barWidth = 0.6;
        const spacing = 1.5;

        values.forEach((value, index) => {
            const height = (value / maxValue) * 12;
            const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
            
            const hue = (index / values.length) * 0.7;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            
            const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.3,
                roughness: 0.4
            });
            
            const bar = new THREE.Mesh(geometry, material);
            bar.position.set(
                (index - values.length / 2) * spacing,
                height / 2,
                0
            );
            bar.castShadow = true;
            parent.add(bar);
        });
    }, []);

  const createLineChart3D = useCallback((parent, data) => {
        const values = data.datasets[0].data;
        const maxValue = Math.max(...values);
        const spacing = 1.5;

        const points = [];
        
        values.forEach((value, index) => {
            const height = (value / maxValue) * 12;
            const point = new THREE.Vector3(
                (index - values.length / 2) * spacing,
                height,
                0
            );
            points.push(point);
        });

        // Create the line/tube
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
        const tubeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x6366f1,
            metalness: 0.5,
            roughness: 0.3
        });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tube.castShadow = true;
        parent.add(tube);

        // Add data point markers (pink/magenta spheres)
        points.forEach((point, index) => {
            const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
            const sphereMaterial = new THREE.MeshStandardMaterial({
                color: 0xff69b4, // Pink/magenta color
                metalness: 0.4,
                roughness: 0.3,
                emissive: 0xff1493,
                emissiveIntensity: 0.2
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.copy(point);
            sphere.castShadow = true;
            parent.add(sphere);
        });
  }, []);
    
    const createPieChart3D = useCallback((parent, data) => {
        const values = data.datasets[0].data;
        const total = values.reduce((a, b) => a + b, 0);
        let currentAngle = 0;
        const radius = 6;
        const height = 3;

        values.forEach((value, index) => {
            const angle = (value / total) * Math.PI * 2;
            
            const geometry = new THREE.CylinderGeometry(
                radius, 
                radius, 
                height, 
                32, 
                1, 
                false, 
                currentAngle, 
                angle
            );
            
            const hue = (index / values.length);
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            
            const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.3,
                roughness: 0.4
            });
            
            const slice = new THREE.Mesh(geometry, material);
            slice.position.y = height / 2;
            slice.castShadow = true;
            parent.add(slice);

            currentAngle += angle;
        });
    }, []);

    const createScatterChart3D = useCallback((parent, data) => {
        const points = data.datasets[0].data;
        
        points.forEach((point, index) => {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 12;
            const z = (Math.random() - 0.5) * 8;

            const size = 0.3 + Math.random() * 0.2;
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            
            const hue = (index / points.length) * 0.8;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            
            const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.4,
                roughness: 0.3
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(x, y, z);
            sphere.castShadow = true;
            parent.add(sphere);
        });
    }, []);

    return (
        <div className="relative w-full h-full">
            <div 
                ref={containerRef} 
                className="w-full h-full"
                style={{ 
                    touchAction: 'none',
                    userSelect: 'none'
                }}
            />
            
            {!isInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading 3D visualization...</p>
                    </div>
                </div>
            )}
            
            {/* Control Instructions */}
            {isInitialized && (
                // <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-gradient-to-br from-white/95 to-indigo-50/95 backdrop-blur-md rounded-xl shadow-2xl p-4 border-2 border-indigo-200/50">
                //     <div className="flex flex-col gap-3">
                //         {/* Header */}
                //         <div className="flex items-center gap-3 pb-2 border-b border-indigo-200">
                //             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                //                 <span className="text-white font-bold text-lg">3D</span>
                //             </div>
                //             <div>
                //                 <span className="font-bold text-gray-800 text-sm sm:text-base">Interactive Controls</span>
                //                 <p className="text-xs text-gray-600">Use mouse or touch to interact</p>
                //             </div>
                //         </div>
                        
                //         {/* Desktop Controls */}
                //         <div className="hidden sm:grid grid-cols-1 gap-2.5 text-xs">
                //             <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                //                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                //                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                //                     </svg>
                //                 </div>
                //                 <div className="flex-1">
                //                     <span className="font-semibold text-gray-800">Left Click + Drag</span>
                //                     <p className="text-gray-600">Rotate the view</p>
                //                 </div>
                //             </div>
                            
                //             <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                //                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                //                     <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                //                     </svg>
                //                 </div>
                //                 <div className="flex-1">
                //                     <span className="font-semibold text-gray-800">Mouse Wheel</span>
                //                     <p className="text-gray-600">Zoom in/out</p>
                //                 </div>
                //             </div>
                            
                //             <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                //                 <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                //                     <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                //                     </svg>
                //                 </div>
                //                 <div className="flex-1">
                //                     <span className="font-semibold text-gray-800">Right Click + Drag</span>
                //                     <p className="text-gray-600">Pan the view</p>
                //                 </div>
                //             </div>
                //         </div>
                        
                //         {/* Mobile/Touch Controls */}
                //         <div className="sm:hidden grid grid-cols-1 gap-2 text-xs">
                //             <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                //                 <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                //                     <span className="text-blue-600 font-bold">1</span>
                //                 </div>
                //                 <div className="flex-1">
                //                     <span className="font-semibold text-gray-800">One Finger</span>
                //                     <p className="text-gray-600 text-xs">Drag to rotate</p>
                //                 </div>
                //             </div>
                            
                //             <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                //                 <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                //                     <span className="text-green-600 font-bold">2</span>
                //                 </div>
                //                 <div className="flex-1">
                //                     <span className="font-semibold text-gray-800">Two Fingers</span>
                //                     <p className="text-gray-600 text-xs">Pinch to zoom, drag to pan</p>
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                // </div>

<div className="absolute bottom-4 left-4 right-4 bg-gradient-to-br from-white/95 to-indigo-50/95 backdrop-blur-md rounded-xl shadow-2xl p-4 border-2 border-indigo-200/50">
    <div className="flex flex-col gap-3">
        {/* Header - Centered */}
        <div className="flex items-center justify-center gap-3 pb-2 border-b border-indigo-200">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">3D</span>
            </div>
            <div className="text-center">
                <span className="font-bold text-gray-800 text-sm sm:text-base">Interactive Controls</span>
                <p className="text-xs text-gray-600">Use mouse or touch to interact</p>
            </div>
        </div>
        
        {/* Desktop Controls - Horizontal Layout */}
        <div className="hidden sm:flex flex-row gap-3 text-xs">
            <div className="flex-1 flex items-center gap-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-800 block">Left Click + Drag</span>
                    <p className="text-gray-600 text-xs truncate">Rotate the view</p>
                </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-800 block">Mouse Wheel</span>
                    <p className="text-gray-600 text-xs truncate">Zoom in/out</p>
                </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-800 block">Right Click + Drag</span>
                    <p className="text-gray-600 text-xs truncate">Pan the view</p>
                </div>
            </div>
        </div>
        
        {/* Mobile/Touch Controls - Horizontal Layout */}
        <div className="sm:hidden flex flex-row gap-3 text-xs">
            <div className="flex-1 flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-800 block">One Finger</span>
                    <p className="text-gray-600 text-xs">Drag to rotate</p>
                </div>
            </div>
            
            <div className="flex-1 flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-800 block">Two Fingers</span>
                    <p className="text-gray-600 text-xs">Pinch & drag</p>
                </div>
            </div>
        </div>
    </div>
</div>


)}
        </div>
    );
});

ThreeDChart.displayName = 'ThreeDChart';

export default ThreeDChart;