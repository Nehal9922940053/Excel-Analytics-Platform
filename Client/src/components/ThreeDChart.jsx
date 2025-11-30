
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