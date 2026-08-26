
const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');


let r1 = 120;
let r2 = 120;   
let m1 = 10;     
let m2 = 10;      


let theta1 = Math.PI / 2 + 0.2; 
let theta2 = Math.PI / 2 + 0.3;

let omega1 = 0;   
let omega2 = 0;   

let g = 0.8;      

let trajectory = []; 

let cx = canvas.width / 2; 
let cy = 180;              


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


function animate() {
    
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    for (let step = 0; step < 5; step++) {
        let { alpha1, alpha2 } = computeAccelerations(theta1, theta2, omega1, omega2);
        
        omega1 += alpha1;
        omega2 += alpha2;
        theta1 += omega1;
        theta2 += omega2;

      
        omega1 *= 0.9995;
        omega2 *= 0.9995;
    }

    
    let x1 = cx + r1 * Math.sin(theta1);
    let y1 = cy + r1 * Math.cos(theta1);

    let x2 = x1 + r2 * Math.sin(theta2);
    let y2 = y1 + r2 * Math.cos(theta2);

    
    trajectory.push({ x: x2, y: y2 });
    if (trajectory.length > 400) {
        trajectory.shift();
    }

 
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

    
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    
    ctx.beginPath();
    ctx.fillStyle = '#f43f5e';
    ctx.arc(x1, y1, m1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#10b981';
    ctx.arc(x2, y2, m2, 0, Math.PI * 2);
    ctx.fill();

    
    requestAnimationFrame(animate);
}


animate();
