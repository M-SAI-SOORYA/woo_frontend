import React, { useEffect, useState } from "react";

const EVENT_NAME = "system-toast";

export function notifySystem({ title, message = "", type = "success", detail = "" }) {
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: { title, message, type, detail, id: Date.now() },
    })
  );
}

export default function SystemToast() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const showNotice = (event) => {
      setNotice(event.detail);
    };
    window.addEventListener(EVENT_NAME, showNotice);
    return () => window.removeEventListener(EVENT_NAME, showNotice);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), 3400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!notice) return null;

  return (
    <aside className={`system-toast system-toast-${notice.type}`} role="status" aria-live="polite">
      <div className="system-toast-scan" />
      <div className="system-toast-core">
        <span className="system-toast-mark">SYSTEM</span>
        <div className="system-toast-copy">
          <strong>{notice.title}</strong>
          {notice.message && <span>{notice.message}</span>}
          {notice.detail && <small>{notice.detail}</small>}
        </div>
      </div>
      <div className="system-toast-progress" />
    </aside>
  );
}
