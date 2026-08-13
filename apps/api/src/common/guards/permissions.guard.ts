import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleName } from '../../../generated/prisma';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Endpoint does not require a permission
    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return false;
    }

    /**
     * SUPER_ADMIN has implicit access to every permission.
     */
    const isSuperAdmin = user.roles?.some((role: any) =>
      typeof role === 'string'
        ? role === RoleName.SUPER_ADMIN
        : role.name === RoleName.SUPER_ADMIN,
    );

    if (isSuperAdmin) {
      return true;
    }

    /**
     * Normal users use their explicitly assigned permissions.
     */
    const userPermissions: string[] = user.permissions ?? [];

    /**
     * OR logic:
     *
     * If the endpoint requires:
     *
     * ['reservations.view', 'reservations.update']
     *
     * the user only needs ONE of them.
     */
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
