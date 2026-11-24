import { useEffect, useRef, useState } from "react";
import { googleClientIdRequest } from "../services/api";

const SCRIPT_URL = "https://accounts.google.com/gsi/client";

export default function GoogleButton({ onCredential }) {
  const buttonRef = useRef(null);
  const callbackRef = useRef(onCredential);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    let active = true;
    googleClientIdRequest()
      .then((id) => {
        if (active) setClientId(id);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!clientId) return;
    let active = true;
    let script = document.querySelector(`script[src="${SCRIPT_URL}"]`);

    function renderButton() {
      if (!active || !window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => callbackRef.current(response.credential),
      });
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: Math.min(Math.max(buttonRef.current.clientWidth, 240), 380),
      });
    }

    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", renderButton);
    renderButton();

    return () => {
      active = false;
      script.removeEventListener("load", renderButton);
    };
  }, [clientId]);

  if (!clientId) return null;
  return (
    <>
      <p className="my-4 text-center text-sm text-gray-500">or</p>
      <div ref={buttonRef} className="flex w-full justify-center" />
    </>
  );
}
