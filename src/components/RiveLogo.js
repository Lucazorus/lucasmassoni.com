"use client";

import { useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

// Logo animé (Rive). `playIntro` déclenche la séquence d'arrivée du loader.
export default function RiveLogo({ className, playIntro = false, introMs = 1200 }) {
  const { rive, RiveComponent } = useRive({
    src: "/logo.riv",
    stateMachines: "SM",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    backgroundColor: "transparent",
  });

  useEffect(() => {
    if (!rive || !playIntro) return;
    const inputs = rive.stateMachineInputs("SM");
    const hover = inputs?.find((i) => i.name === "LogoHover");
    if (hover) hover.value = true;
    const t = setTimeout(() => {
      const click = rive.stateMachineInputs("SM")?.find((i) => i.name === "Click");
      if (click) click.fire();
    }, introMs / 2);
    return () => clearTimeout(t);
  }, [rive, playIntro, introMs]);

  return (
    <div className={className} aria-hidden="true">
      <RiveComponent className="w-full h-full" />
    </div>
  );
}
