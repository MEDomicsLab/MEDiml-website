const normalize = (path) => path.replace(/\/+$/, "") || "/";

export function isPrerenderedRoute() {
  const route = document.getElementById("root")?.dataset.route;
  return !!route && normalize(route) === normalize(window.location.pathname);
}
