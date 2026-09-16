let idx = 0;
const slides = [...document.querySelectorAll('.slide')];

function show(n) {
  idx = (n + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === idx);
  });

  const progress = document.getElementById('progress');
  if (progress) {
    progress.style.width = `${((idx + 1) / slides.length) * 100}%`;
  }
}

function runCode(editorId, outputId) {
  const source = document.getElementById(editorId).value;
  const output = document.getElementById(outputId);
  const logs = [];

  const oldLog = console.log;
  const oldErr = console.error;

  console.log = (...args) => {
    logs.push(args.map((item) => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(' '));
    oldLog(...args);
  };

  console.error = (...args) => {
    logs.push(`ERRO: ${args.join(' ')}`);
    oldErr(...args);
  };

  try {
    new Function(source)();
    output.textContent = logs.join('\n') || 'Código executado sem saída.';
  } catch (error) {
    output.textContent = `ERRO: ${error.message}`;
  } finally {
    console.log = oldLog;
    console.error = oldErr;
  }
}

document.addEventListener('keydown', (event) => {
  if (event.target.tagName === 'TEXTAREA') return;

  if (event.key === 'ArrowRight' || event.key === 'PageDown') show(idx + 1);
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') show(idx - 1);
  if (event.key.toLowerCase() === 'r') show(0);
  if (event.key.toLowerCase() === 'f') document.documentElement.requestFullscreen?.();
});

const prevButton = document.querySelector('.nav-btn.prev');
const nextButton = document.querySelector('.nav-btn.next');

prevButton?.addEventListener('click', () => show(idx - 1));
nextButton?.addEventListener('click', () => show(idx + 1));

document.querySelectorAll('.slide .top').forEach((top) => {
  const nextSibling = top.nextElementSibling;
  if (nextSibling && nextSibling.classList.contains('teacher-name')) return;

  const teacherName = document.createElement('div');
  teacherName.className = 'teacher-name';
  teacherName.textContent = 'ESP. WELLITON CUNHA';
  top.insertAdjacentElement('afterend', teacherName);
});

show(0);
