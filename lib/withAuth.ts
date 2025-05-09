import { NextRequest } from "next/server";

// This is a higher-order function that wraps a handler and injects a dummy x-user-email header
export function withAuth<
  T extends (req: NextRequest, ...args: unknown[]) => Promise<unknown>
>(
  handler: T
): (req: NextRequest, ...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (
    req: NextRequest,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> => {
    const newHeaders = new Headers(req.headers);

    // Extract email from search params
    const email = req.nextUrl?.searchParams?.get("email") || "test@test.com";
    newHeaders.set("x-user-email", email);

    const authReq = new NextRequest(req.url, {
      method: req.method,
      headers: newHeaders,
      body: req.body,
    });

    return handler(authReq, ...args) as ReturnType<T>;
  };
}
