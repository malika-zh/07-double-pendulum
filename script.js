// Получаем доступ к холсту из HTML и его графическому контексту 2D
const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');

// --- 1. ФИЗИЧЕСКИЕ ПЕРЕМЕННЫЕ ---
let r1 = 120;     // Длина первого стержня
let r2 = 120;     // Длина второго стержня
let m1 = 10;      // Масса первого грузика
let m2 = 10;      // Масса второго грузика

// Добавляем небольшой сдвиг (+0.2 и +0.3), чтобы система сразу вывелась из равновесия и закрутилась
let theta1 = Math.PI / 2 + 0.2; 
let theta2 = Math.PI / 2 + 0.3;

let omega1 = 0;   // Начальная скорость 1
let omega2 = 0;   // Начальная скорость 2

let g = 0.8;      // Гравитационная постоянная для пикселей

let trajectory = []; // Массив для шлейфа хаоса

let cx = canvas.width / 2; // Центр экрана по X
let cy = 180;              // Точка крепления маятника по Y

// Функция расчета ускорений по уравнениям Лагранжа
function computeAccelerations(t1, t2, w1, w2) {
    let delta = t1 - t2;

    let num1 = -g * (2 * m1 + m2) * Math.sin(t1) - m2 * g * Math.sin(t1 - 2 * t2) - 2 * Math.sin(delta) * m2 * (w2 * w2 * r2 + w1 * w1 * r1 * Math.cos(delta));
    let den1 = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * t1 - 2 * t2));
    let alpha1 = num1 / den1;

    let num2 = 2 * Math.sin(delta) * (w1 * w1 * r1 * (m1 + m2) + g * (m1 + m2) * Math.cos(t1) + w2 * w2 * r2 * m2 * Math.cos(delta));
    let den2 = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * t1 - 2 * t2));
    let alpha2 = num2 / den2;

    return { alpha1, alpha2 };
}

// Главный цикл анимации
function animate() {
    // Очищаем экран
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Делаем несколько микро-шагов за кадр для высокой точности физики
    for (let step = 0; step < 5; step++) {
        let { alpha1, alpha2 } = computeAccelerations(theta1, theta2, omega1, omega2);
        
        omega1 += alpha1;
        omega2 += alpha2;
        theta1 += omega1;
        theta2 += omega2;

        // Легкое затухание (трение воздуха)
        omega1 *= 0.9995;
        omega2 *= 0.9995;
    }

    // Координаты грузиков
    let x1 = cx + r1 * Math.sin(theta1);
    let y1 = cy + r1 * Math.cos(theta1);

    let x2 = x1 + r2 * Math.sin(theta2);
    let y2 = y1 + r2 * Math.cos(theta2);

    // Сохраняем точку для шлейфа
    trajectory.push({ x: x2, y: y2 });
    if (trajectory.length > 400) {
        trajectory.shift();
    }

    // Отрисовка хвоста хаоса
    ctx.beginPath();
    for (let i = 0; i < trajectory.length - 1; i++) {
        let p1 = trajectory[i];
        let p2 = trajectory[i + 1];
        ctx.strokeStyle = `rgba(56, 189, 248, ${i / trajectory.length})`;
        ctx.lineWidth = 2;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }

    // Отрисовка стержней
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Грузики (красный и зеленый)
    ctx.beginPath();
    ctx.fillStyle = '#f43f5e';
    ctx.arc(x1, y1, m1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#10b981';
    ctx.arc(x2, y2, m2, 0, Math.PI * 2);
    ctx.fill();

    // Запрос следующего кадра анимации
    requestAnimationFrame(animate);
}

// Запуск симуляции
animate();