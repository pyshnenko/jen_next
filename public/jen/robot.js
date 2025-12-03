import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import { Stats } from 'three/addons/libs/stats.module.js';

// Глобальные переменные
let container, stats, clock, mixer, actions, activeAction;
let camera, scene, renderer, model;
let rain;

// Инициализация
init();

function init() {
  clock = new THREE.Clock();

  const canvasContainer = document.getElementById('robot');
  if (!canvasContainer) {
    console.error('Контейнер #robot не найден');
    return;
  }

  container = document.createElement('div');
  canvasContainer.appendChild(container);

  // === ОРТОГРАФИЧЕСКАЯ КАМЕРА ===
  const worldWidth = 120;
  const worldHeight = worldWidth * (canvasContainer.clientHeight / canvasContainer.clientWidth);

  camera = new THREE.OrthographicCamera(
    -worldWidth / 2,
    worldWidth / 2,
    worldHeight / 2,
    -worldHeight / 2,
    0.1,
    1000
  );
  camera.position.set(0, 10, 50);
  camera.lookAt(0, 1, 0);
  camera.updateProjectionMatrix();

  // === СЦЕНА ===
  scene = new THREE.Scene();
  scene.background = null;

  // === ОСВЕЩЕНИЕ ===
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 1);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(0, 20, 10);
  scene.add(dirLight);

  // === ЗАГРУЗКА МОДЕЛИ ===
  const loader = new GLTFLoader();
  loader.load(
    '/library/threejs/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    (gltf) => {
      model = gltf.scene;
      model.position.set(-40, -10, 0);
      const scale = window.innerWidth < 900 ? 4 : 2
      model.scale.set(scale, scale, scale); // увеличена
      scene.add(model);

      // 🟢 Отладка: если не видно — добавь это временно
      // const axes = new THREE.AxesHelper(10);
      // scene.add(axes);

      initAnimations(gltf.animations);
    },
    undefined,
    (e) => console.error('Ошибка загрузки:', e)
  );

  // === РЕНДЕРЕР ===
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  container.appendChild(renderer.domElement);


  // === РЕСАЙЗ ===
  window.addEventListener('resize', onWindowResize);

  // === АНИМАЦИЯ ===
  renderer.setAnimationLoop(animate);
}


function initAnimations(animations) {
  mixer = new THREE.AnimationMixer(model);
  actions = {};

  // Список состояний
  const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];

  // Создаём анимации
  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i];
    const action = mixer.clipAction(clip);
    actions[clip.name] = action;

    if (states.indexOf(clip.name) >= 4) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  }

  // Начинаем с Idle
  activeAction = actions['Idle'];
  if (activeAction) activeAction.play();

  // Запускаем сцену
  startRobotJourney();
}
const wolkTime = window.innerWidth > 900 ? 5000 : 2500
async function startRobotJourney() {
 await rotateModelTo(Math.PI / 2); // вправо
fadeToAction('Walking', 0.5);
await moveModelTo(0, wolkTime); // 10 сек
fadeToAction('Idle', 0.5);
await rotateModelTo(0);
if (Math.random() < 0.7) {
  playEmote('Wave');
}
await new Promise(r => setTimeout(r, 2000));

// Из 0 в 50 → 10 сек
await rotateModelTo(Math.PI / 2);
fadeToAction('Walking', 0.5);
await moveModelTo(40, wolkTime);
fadeToAction('Idle', 0.5);
await rotateModelTo(0);
await new Promise(r => setTimeout(r, 2000));

// Из 50 в -50 → 10 сек (бег)
await rotateModelTo(-Math.PI / 2); // влево
fadeToAction('Running', 0.5);
await moveModelTo(-40, wolkTime);
fadeToAction('Dance', 0.5);
createRainEffect();
await rotateModelTo(0);

  // Ждём 5 сек танца
  await new Promise(r => setTimeout(r, 5000));

  // Убираем дождь
  if (rain) {
    scene.remove(rain);
    rain.geometry.dispose();
    rain.material.dispose();
    rain = null;
  }

  fadeToAction('Idle', 0.5);
  await rotateModelTo(0);

  await new Promise(r => setTimeout(r, 2000));

  // 🔁 Запускаем снова
  startRobotJourney();
}

// Плавное перемещение по X
function moveModelTo(targetX, duration = 10000) {
  return new Promise((resolve) => {
    const startX = model.position.x;
    const startTime = performance.now();

    function animate() {
      const now = performance.now();
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1); // t: [0..1]
      const easedT = easeOutQuad(t);

      // Плавный переход
      model.position.x = startX + (targetX - startX) * easedT;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve(); // завершаем, когда t=1
      }
    }

    animate();
  });
}

// Плавная функция
function easeOutQuad(t) {
  return t//t === 1 ? 1 : -t * (t - 2);
}

// Смена анимации с плавным переходом
function fadeToAction(name, duration) {
  const previousAction = activeAction;
  const nextAction = actions[name];
  if (previousAction === nextAction) return;

  nextAction.reset().setEffectiveWeight(1).fadeIn(duration).play();
  if (previousAction) {
    previousAction.setEffectiveWeight(0).fadeOut(duration);
  }
  activeAction = nextAction;
}

// Эффект "дождя" вокруг робота
function createRainEffect() {
  console.log("🌧️ Эффект дождя запущен!");

  // Удаляем предыдущий эффект
  if (rain) {
    scene.remove(rain);
    rain.geometry.dispose();
    rain.material.dispose();
  }

  const count = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 20 - 50; // x около робота
    positions[i + 1] = Math.random() * 15 + 5;          // y сверху
    positions[i + 2] = (Math.random() - 0.5) * 15;      // z по ширине
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x4ade4f,
    size: 0.3,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  rain = new THREE.Points(geometry, material);
  scene.add(rain);

  // Анимация падения
  function animateRain() {
    if (!rain) return;

    const array = rain.geometry.attributes.position.array;
    for (let i = 1; i < array.length; i += 3) {
      array[i] -= 0.3;
      if (array[i] < -5) {
        array[i] = Math.random() * 10 + 10; // появляется сверху
      }
    }
    rain.geometry.attributes.position.needsUpdate = true;
    requestAnimationFrame(animateRain);
  }

  animateRain();
}

// Обработка изменения размера окна
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Основной цикл анимации
function animate() {
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
  //if (stats) stats.update();
}

function rotateModelTo(targetY, duration = 500) {
  return new Promise((resolve) => {
    const start = model.rotation.y;
    const distance = targetY - start;
    const startTime = performance.now();

    function animate() {
      const now = performance.now();
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutQuad(t);

      model.rotation.y = start + distance * easedT;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    animate();
  });
}

function playEmote(name, duration = 0.2) {
  const emoteAction = actions[name];
  if (!emoteAction) {
    console.warn(`Анимация "${name}" не найдена`);
    return;
  }

  // Сохраняем текущее действие (например, Idle)
  const prevAction = activeAction;

  // Воспроизводим эмоцию
  emoteAction.reset().setEffectiveWeight(1).fadeIn(duration).play();
  emoteAction.clampWhenFinished = true;
  emoteAction.loop = THREE.LoopOnce;

  activeAction = emoteAction;

  // Возвращаемся к предыдущей анимации после завершения
  /*emoteAction.addEventListener('finished', () => {
    emoteAction.fadeOut(duration);
    prevAction
      .reset()
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
    activeAction = prevAction;
  });*/
}

function createEmoteCallback( name ) {
    api[ name ] = function () {
        fadeToAction( name, 0.2 );
        mixer.addEventListener( 'finished', restoreState );
    };
    emoteFolder.add( api, name );
}