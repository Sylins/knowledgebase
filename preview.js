document.addEventListener("DOMContentLoaded", () => {
    const preview = document.createElement('div');
    preview.style.cssText = `
        display: none;
        position: fixed;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        width: 400px;
        max-height: 300px;
        overflow-y: auto;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        pointer-events: none;
    `;
    document.body.appendChild(preview);

    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('mouseenter', async () => {
            try {
                const url = new URL(link.href, location.href);
                const hash = url.hash;
                const html = await fetch(url).then(r => r.text());
                const doc = new DOMParser().parseFromString(html, 'text/html');

                let content;
                if (hash) {
                    const target = doc.querySelector(hash);
                    content = target ? target.innerHTML : '未找到该段落';
                } else {
                    const body = doc.querySelector('body');
                    content = body ? body.innerHTML.substring(0, 500) + '...' : '无法加载';
                }

                preview.innerHTML = content;
                preview.style.display = 'block';
            } catch {
                preview.innerHTML = '加载失败';
                preview.style.display = 'block';
            }
        });

        link.addEventListener('mousemove', (e) => {
            const x = e.clientX + 15;
            const y = e.clientY + 15;
            const maxX = window.innerWidth - 420;
            const maxY = window.innerHeight - 320;
            preview.style.left = (x > maxX ? x - 430 : x) + 'px';
            preview.style.top = (y > maxY ? y - 320 : y) + 'px';
        });

        link.addEventListener('mouseleave', () => {
            preview.style.display = 'none';
        });
    });
});