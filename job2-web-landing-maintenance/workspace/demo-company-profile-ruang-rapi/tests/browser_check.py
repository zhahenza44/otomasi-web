import base64
import functools
import http.server
import json
import os
import socket
import struct
import threading
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read_exact(sock, size):
    data = b''
    while len(data) < size:
        chunk = sock.recv(size - len(data))
        if not chunk:
            raise ConnectionError('socket closed')
        data += chunk
    return data


def send_frame(sock, obj):
    data = json.dumps(obj).encode('utf-8')
    mask = os.urandom(4)
    header = bytearray([0x81])
    length = len(data)
    if length < 126:
        header.append(0x80 | length)
    elif length < 65536:
        header.append(0x80 | 126)
        header.extend(struct.pack('!H', length))
    else:
        header.append(0x80 | 127)
        header.extend(struct.pack('!Q', length))
    header.extend(mask)
    masked = bytes(byte ^ mask[i % 4] for i, byte in enumerate(data))
    sock.sendall(bytes(header) + masked)


def recv_frame(sock):
    first, second = read_exact(sock, 2)
    opcode = first & 0x0F
    length = second & 0x7F
    if length == 126:
        length = struct.unpack('!H', read_exact(sock, 2))[0]
    elif length == 127:
        length = struct.unpack('!Q', read_exact(sock, 8))[0]
    mask = read_exact(sock, 4) if second & 0x80 else None
    payload = read_exact(sock, length)
    if mask:
        payload = bytes(byte ^ mask[i % 4] for i, byte in enumerate(payload))
    if opcode == 0x8:
        raise ConnectionError('websocket closed by peer')
    return json.loads(payload.decode('utf-8'))


class Bidi:
    def __init__(self, host='127.0.0.1', port=9222):
        self.sock = socket.create_connection((host, port), timeout=15)
        key = base64.b64encode(os.urandom(16)).decode()
        request = (
            'GET /session HTTP/1.1\r\n'
            f'Host: {host}:{port}\r\n'
            'Upgrade: websocket\r\n'
            'Connection: Upgrade\r\n'
            f'Sec-WebSocket-Key: {key}\r\n'
            'Sec-WebSocket-Version: 13\r\n\r\n'
        )
        self.sock.sendall(request.encode())
        headers = b''
        while b'\r\n\r\n' not in headers:
            headers += self.sock.recv(4096)
        status = headers.split(b'\r\n', 1)[0]
        if b'101' not in status:
            raise RuntimeError(f'handshake failed: {status!r}')
        self.next_id = 0

    def command(self, method, params):
        self.next_id += 1
        request_id = self.next_id
        send_frame(self.sock, {'id': request_id, 'method': method, 'params': params})
        while True:
            message = recv_frame(self.sock)
            if message.get('id') != request_id:
                continue
            if 'error' in message:
                raise RuntimeError(f'{method}: {message["error"]}')
            return message['result']

    def close(self):
        self.sock.close()


view_width, view_height = (int(part) for part in os.environ.get('VIEWPORT', '390x844').split('x'))

handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
server = http.server.ThreadingHTTPServer(('127.0.0.1', 8767), handler)
threading.Thread(target=server.serve_forever, daemon=True).start()

expression = r'''(async () => {
  const out = {};
  const doc = document;
  const win = window;
  const allProjects = () => Array.from(doc.querySelectorAll('.project'));
  const titleOf = (el) => el ? el.dataset.title : null;

  doc.querySelector('[data-filter="dapur"]').click();
  const visibleProjects = allProjects().filter((project) => !project.hidden);
  const visibleTitles = visibleProjects.map(titleOf);
  const first = visibleProjects[0];
  first.focus();
  first.click();
  out.initialTitle = doc.querySelector('#lightbox-title').textContent;
  out.initialFocus = doc.activeElement.id;
  out.inertOnOpen = Array.from(doc.querySelectorAll('header, main, footer')).every(
    (el) => el.hasAttribute('inert')
  );

  const next = doc.querySelector('#lightbox-next');
  next.focus();
  next.click();
  out.afterNextTitle = doc.querySelector('#lightbox-title').textContent;
  out.nextTitleIsVisible = visibleTitles.includes(out.afterNextTitle);
  out.focusAfterNext = doc.activeElement.id;

  doc.querySelector('#project-lightbox').dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
  );
  out.closedAfterEscape = doc.querySelector('#project-lightbox').hidden;
  out.restoredFocus = doc.activeElement === first;
  out.inertAfterClose = Array.from(doc.querySelectorAll('header, main, footer')).every(
    (el) => !el.hasAttribute('inert')
  );

  const sticky = doc.querySelector('#sticky-consult');
  const consultRect = doc.querySelector('#konsultasi').getBoundingClientRect();
  win.scrollTo(0, consultRect.top + win.scrollY);
  await new Promise((resolve) => setTimeout(resolve, 400));
  out.scrollY = win.scrollY;
  out.stickyHiddenNearConsult = sticky.classList.contains('is-hidden');
  out.stickyVisibility = win.getComputedStyle(sticky).visibility;
  out.bodyPaddingClass = doc.body.classList.contains('has-sticky-cta');

  doc.querySelector('[data-filter="all"]').click();
  let captured = null;
  win.open = (url) => { captured = url; return { opener: null }; };
  const form = doc.querySelector('#consult-form');
  form.querySelector('[name="nama"]').value = 'Uji Otak';
  form.querySelector('[name="wa"]').value = '08123456789';
  form.querySelector('[name="layanan"]').value = 'Dapur & wardrobe';
  form.querySelector('[name="budget"]').value = 'Rp 5–15 juta';
  form.querySelector('[name="pesan"]').value = 'Cek pesan otomatis.';
  form.requestSubmit();
  out.waMessage = captured ? decodeURIComponent(captured.split('?text=')[1]) : null;
  out.waHasArea = out.waMessage ? out.waMessage.includes('Area:') : null;
  out.waHasAllFields = out.waMessage
    ? ['Uji Otak', '08123456789', 'Dapur & wardrobe', 'Rp 5–15 juta', 'Cek pesan otomatis.'].every(
        (value) => out.waMessage.includes(value)
      )
    : false;

  out.viewportWidth = win.innerWidth;
  out.noHorizontalOverflow = doc.documentElement.scrollWidth <= win.innerWidth + 1;
  out.overflowing = Array.from(doc.querySelectorAll('body *'))
    .filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.right > win.innerWidth + 1;
    })
    .slice(0, 12)
    .map((el) => ({
      tag: el.tagName,
      id: el.id,
      className: String(el.getAttribute('class') || ''),
      right: Math.round(el.getBoundingClientRect().right),
      width: Math.round(el.getBoundingClientRect().width),
    }));
  return JSON.stringify(out);
})()'''

bidi = Bidi()
try:
    session_info = bidi.command('session.new', {
        'capabilities': {'alwaysMatch': {'browserName': 'firefox'}}
    })
    session_id = session_info.get('sessionId')
    tree = bidi.command('browsingContext.getTree', {})
    context = tree['contexts'][0]['context']
    bidi.command('browsingContext.setViewport', {
        'context': context,
        'viewport': {'width': view_width, 'height': view_height},
    })
    bidi.command('browsingContext.navigate', {
        'context': context,
        'url': 'http://127.0.0.1:8767/index.html',
        'wait': 'complete',
    })
    result = bidi.command('script.evaluate', {
        'expression': expression,
        'target': {'context': context},
        'awaitPromise': True,
        'resultOwnership': 'root',
    })
    value = result['result']['value']
    data = json.loads(value)
    print(json.dumps(data, ensure_ascii=False, indent=2))

    failures = []
    checks = {
        'lightbox opens filtered card': data['initialTitle'] in ('Dapur kerja Kemang', 'Ruang makan Bekasi'),
        'focus starts on close button': data['initialFocus'] == 'lightbox-close',
        'background landmarks inert on open': data['inertOnOpen'] is True,
        'next stays inside active filter': data['nextTitleIsVisible'] is True,
        'focus stays on next control': data['focusAfterNext'] == 'lightbox-next',
        'escape closes lightbox': data['closedAfterEscape'] is True,
        'focus returns to source card': data['restoredFocus'] is True,
        'inert removed after close': data['inertAfterClose'] is True,
        'sticky hides near consult': data['stickyHiddenNearConsult'] is True,
        'hidden sticky not tabbable': data['stickyVisibility'] == 'hidden',
        'body padding class toggles off': data['bodyPaddingClass'] is False,
        'WA message has five fields': data['waHasAllFields'] is True,
        'WA message has no Area line': data['waHasArea'] is False,
        f'no horizontal overflow at {view_width}px': data['noHorizontalOverflow'] is True,
    }
    for name, ok in checks.items():
        print(('PASS  ' if ok else 'FAIL  ') + name)
        if not ok:
            failures.append(name)
    raise SystemExit(1 if failures else 0)
finally:
    try:
        bidi.command('session.end', {})
    except Exception as error:
        print(f'session.end skipped: {error}')
    bidi.close()
    server.shutdown()
