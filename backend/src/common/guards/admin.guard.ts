import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

/** Gates owner-only GraphQL mutations and the upload endpoint behind a single
 * shared `Authorization: Bearer <ADMIN_TOKEN>` header — there's exactly one owner
 * and no admin UI, so a full login/session system would be pure overhead. */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request =
      context.getType<"http" | "graphql">() === "graphql"
        ? GqlExecutionContext.create(context).getContext().req
        : context.switchToHttp().getRequest();

    const header = request?.headers?.authorization as string | undefined;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || !token || token !== adminToken) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
