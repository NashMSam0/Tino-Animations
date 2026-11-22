import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
type ThreeModule = typeof import('three');

/** A small decorative 3D field of story sparks for the home hero. */
@Component({
  selector: 'app-story-backdrop',
  standalone: true,
  template: '<canvas #sceneCanvas aria-hidden="true"></canvas>',
  styles: [':host { position: absolute; inset: 0; display: block; pointer-events: none; } canvas { display: block; width: 100%; height: 100%; } canvas[hidden] { display: none; }']
})
export class StoryBackdrop implements AfterViewInit, OnDestroy {
  @ViewChild('sceneCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private three?: ThreeModule;
  private renderer?: any;
  private resizeObserver?: ResizeObserver;
  private scene?: any;
  private camera?: any;
  private readonly stars: any[] = [];
  private readonly starPhases: number[] = [];
  private readonly starBaseY: number[] = [];
  private points?: any;
  private pointBase: Float32Array = new Float32Array();
  private viewWidth = 1;
  private viewHeight = 1;
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  private lastFrame = 0;
  private destroyed = false;
  private frame: ((time: number) => void) | null = null;

  private readonly onVisibilityChange = () => {
    if (!this.renderer || !this.frame || this.reducedMotion.matches) return;
    this.renderer.setAnimationLoop(document.hidden ? null : this.frame);
  };

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    void import('three').then(THREE => {
      if (this.destroyed) return;
      try { this.initialize(THREE); }
      catch { canvas.hidden = true; }
    }).catch(() => { canvas.hidden = true; });
  }

  private initialize(THREE: ThreeModule): void {
    const canvas = this.canvasRef.nativeElement;
    this.three = THREE;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.setClearColor(0x000000, 0);
      this.camera.position.z = 8;

      this.addStorySparks(THREE);
      this.resize();
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas.parentElement ?? canvas);

      this.frame = (time: number) => {
        if (time - this.lastFrame < 32) return;
        this.lastFrame = time;
        const seconds = time * 0.00035;
        const points = this.points;
        const scene = this.scene;
        const camera = this.camera;
        if (!points || !scene || !camera) return;
        const attribute = points.getAttribute('position');
        const positions = attribute.array as Float32Array;
        for (let i = 0; i < this.starPhases.length; i++) {
          const offset = i * 3;
          positions[offset] = this.pointBase[offset] * this.viewWidth + Math.sin(seconds + this.starPhases[i]) * 0.035;
          positions[offset + 1] = this.pointBase[offset + 1] * this.viewHeight + Math.cos(seconds * 1.4 + this.starPhases[i]) * 0.06;
        }
        attribute.needsUpdate = true;
        this.stars.forEach((star, i) => {
          const phase = this.starPhases[i];
          star.rotation.x = Math.sin(seconds + phase) * 0.3;
          star.rotation.y += 0.003 + i * 0.0004;
          star.position.y = this.starBaseY[i] + Math.sin(seconds * 1.5 + phase) * 0.035;
        });
        this.renderer?.render(scene, camera);
      };

      this.renderOnce();
      if (!this.reducedMotion.matches && !document.hidden) this.renderer.setAnimationLoop(this.frame);
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    } catch {
      canvas.hidden = true;
    }
  }

  private addStorySparks(THREE: ThreeModule): void {
    const scene = this.scene;
    if (!scene) return;
    const count = 52;
    this.pointBase = new Float32Array(count * 3);
    const random = (seed: number) => {
      const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return value - Math.floor(value);
    };

    for (let i = 0; i < count; i++) {
      this.pointBase[i * 3] = random(i + 1) - 0.5;
      this.pointBase[i * 3 + 1] = random(i + 83) - 0.5;
      this.pointBase[i * 3 + 2] = random(i + 199) * 1.4 - 0.7;
      this.starPhases.push(random(i + 317) * Math.PI * 2);
    }

    const points = new THREE.BufferGeometry();
    this.points = points;
    points.setAttribute('position', new THREE.BufferAttribute(this.pointBase.slice(), 3));
    scene.add(new THREE.Points(points, new THREE.PointsMaterial({
      color: 0xf4d99e,
      size: 0.045,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      sizeAttenuation: true
    })));

    const starShape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? 0.15 : 0.065;
      const angle = Math.PI * i / 5 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const starGeometry = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015
    });
    const colors = [0xf0d08a, 0xe8bd75, 0xc8d0a2, 0xf5e2b9];
    for (let i = 0; i < colors.length; i++) {
      const star = new THREE.Mesh(starGeometry, new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.78,
        depthWrite: false
      }));
      star.position.set((i - 1.5) * 0.72, (i % 2 ? 0.7 : -0.75), 0.35);
      this.starBaseY.push(star.position.y);
      star.scale.setScalar(0.65 + (i % 2) * 0.3);
      scene.add(star);
      this.stars.push(star);
    }
  }

  private resize(): void {
    if (!this.renderer || !this.camera || !this.points || !this.three || !this.scene) return;
    const THREE = this.three;
    const canvas = this.canvasRef.nativeElement;
    const box = canvas.parentElement?.getBoundingClientRect();
    const width = Math.max(1, box?.width ?? canvas.clientWidth);
    const height = Math.max(1, box?.height ?? canvas.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    const visibleHeight = 2 * this.camera.position.z * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const visibleWidth = visibleHeight * this.camera.aspect;
    this.viewWidth = visibleWidth * 1.1;
    this.viewHeight = visibleHeight * 1.1;
    const attribute = this.points.getAttribute('position');
    const positions = attribute.array as Float32Array;
    for (let i = 0; i < this.starPhases.length; i++) {
      positions[i * 3] = this.pointBase[i * 3] * this.viewWidth;
      positions[i * 3 + 1] = this.pointBase[i * 3 + 1] * this.viewHeight;
    }
    attribute.needsUpdate = true;
    this.stars.forEach((star, i) => {
      star.position.x = (i - 1.5) * visibleWidth * 0.19;
      star.position.y = (i % 2 ? 0.2 : -0.24) * visibleHeight;
      this.starBaseY[i] = star.position.y;
    });
    this.renderOnce();
  }

  private renderOnce(): void {
    if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.resizeObserver?.disconnect();
    this.renderer?.setAnimationLoop(null);
    this.points?.dispose();
    const THREE = this.three;
    this.scene?.traverse((object: any) => {
      if (!THREE) return;
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material: any) => material.dispose());
      }
      if (object instanceof THREE.Points) object.material.dispose();
    });
    this.renderer?.dispose();
  }
}
