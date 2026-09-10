import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";

/** ThrottlerGuard reads the request via `context.switchToHttp()`, which doesn't
 * resolve correctly for GraphQL resolvers — this pulls it from the GraphQL
 * execution context instead (the req/res `GraphQLModule.forRoot`'s `context`
 * factory puts there). */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    return { req: gqlContext.req, res: gqlContext.res };
  }
}
