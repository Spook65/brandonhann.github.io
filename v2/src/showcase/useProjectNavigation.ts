import { useEffect, useState } from "react";
import { projectFromHash } from "../data/caseStudies";
export function useProjectNavigation() {
  const [selected, setSelected] = useState("project-mapetite");
  useEffect(() => {
    const sync = () =>
      setSelected(projectFromHash(window.location.hash) ?? "project-mapetite");
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);
  return selected;
}
