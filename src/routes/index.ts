export type RouteHandler = (req: Request, params: Record<string, string>) => Response | Promise<Response>;

interface Route {
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

export class Router {
  private routes: Map<string, Route[]> = new Map();

  constructor() {
    for (const method of ["GET", "POST", "PUT", "DELETE", "PATCH"]) {
      this.routes.set(method, []);
    }
  }

  private addRoute(method: string, path: string, handler: RouteHandler) {
    const paramNames: string[] = [];
    const patternStr = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
    const pattern = new RegExp(`^${patternStr}$`);
    this.routes.get(method)?.push({ pattern, paramNames, handler });
  }

  get(path: string, handler: RouteHandler) {
    this.addRoute("GET", path, handler);
    return this;
  }

  post(path: string, handler: RouteHandler) {
    this.addRoute("POST", path, handler);
    return this;
  }

  put(path: string, handler: RouteHandler) {
    this.addRoute("PUT", path, handler);
    return this;
  }

  delete(path: string, handler: RouteHandler) {
    this.addRoute("DELETE", path, handler);
    return this;
  }

  match(method: string, pathname: string): { handler: RouteHandler; params: Record<string, string> } | null {
    const routes = this.routes.get(method) || [];
    for (const route of routes) {
      const match = pathname.match(route.pattern);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1] ?? "";
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }
}
