import { RoleName } from '../generated/prisma';
import { PrismaService } from '../src/prisma/prisma.service';
import * as argon2 from 'argon2';

import { PERMISSIONS } from '../src/constants/permission.constant';
import { ROLE_PERMISSIONS } from '../src/constants/role_permission.constant';

const prisma = new PrismaService();

async function main() {
  console.log('Starting PMS database seed...');

  /**
   * ---------------------------------------------------------
   * 1. Create system roles
   * ---------------------------------------------------------
   */

  const roles = Object.values(RoleName);

  await prisma.role.createMany({
    data: roles.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log(`✓ Created/verified ${roles.length} roles`);

  /**
   * ---------------------------------------------------------
   * 2. Create system permissions
   * ---------------------------------------------------------
   *
   * Permissions are immutable system records.
   *
   * SUPER_ADMIN does NOT need a permission record such as "*".
   * SUPER_ADMIN is handled specially by the authorization layer.
   */

  const permissions = Object.values(PERMISSIONS);

  await prisma.permission.createMany({
    data: permissions.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log(`✓ Created/verified ${permissions.length} permissions`);

  /**
   * ---------------------------------------------------------
   * 3. Create RolePermission relationships
   * ---------------------------------------------------------
   *
   * SUPER_ADMIN intentionally has no RolePermission records.
   *
   * The authorization service should treat:
   *
   *     SUPER_ADMIN === access to every permission
   *
   * This means adding a new permission later automatically gives
   * SUPER_ADMIN access without needing to update this table.
   */

  for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.findUnique({
      where: {
        name: roleName as RoleName,
      },
    });

    if (!role) {
      console.warn(`⚠ Role not found: ${roleName}`);
      continue;
    }

    // SUPER_ADMIN has implicit access to every permission.
    if (role.name === RoleName.SUPER_ADMIN) {
      console.log(
        `✓ Skipping permission relationships for ${RoleName.SUPER_ADMIN}`,
      );

      continue;
    }

    for (const permissionName of permissionNames) {
      /**
       * This protects the seed if '*' is accidentally included
       * in ROLE_PERMISSIONS.
       */
      if (permissionName === '*') {
        continue;
      }

      const permission = await prisma.permission.findUnique({
        where: {
          name: permissionName,
        },
      });

      if (!permission) {
        console.warn(
          `⚠ Permission not found: ${permissionName} for role ${roleName}`,
        );

        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },

        update: {},

        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }

    console.log(`✓ Synced permissions for ${roleName}`);
  }

  console.log('✓ Role-permission relationships synchronized');

  /**
   * ---------------------------------------------------------
   * 4. Create / update Super Admin user
   * ---------------------------------------------------------
   */

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminName = process.env.SUPER_ADMIN_NAME;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!superAdminEmail) {
    throw new Error('SUPER_ADMIN_EMAIL environment variable is required');
  }

  if (!superAdminName) {
    throw new Error('SUPER_ADMIN_NAME environment variable is required');
  }

  if (!superAdminPassword) {
    throw new Error('SUPER_ADMIN_PASSWORD environment variable is required');
  }

  const hashedPassword = await argon2.hash(superAdminPassword);

  const superAdmin = await prisma.user.upsert({
    where: {
      email: superAdminEmail,
    },

    update: {
      fullname: superAdminName,
      password: hashedPassword,
    },

    create: {
      email: superAdminEmail,
      fullname: superAdminName,
      password: hashedPassword,
    },
  });

  console.log(`✓ Created/updated super admin user: ${superAdmin.id}`);

  /**
   * ---------------------------------------------------------
   * 5. Find SUPER_ADMIN role
   * ---------------------------------------------------------
   */

  const superAdminRole = await prisma.role.findUnique({
    where: {
      name: RoleName.SUPER_ADMIN,
    },
  });

  if (!superAdminRole) {
    throw new Error(`${RoleName.SUPER_ADMIN} role was not found`);
  }

  /**
   * ---------------------------------------------------------
   * 6. Assign SUPER_ADMIN role to the seed user
   * ---------------------------------------------------------
   */

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: superAdminRole.id,
      },
    },

    update: {},

    create: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  });

  console.log(`✓ Linked ${superAdminEmail} to ${RoleName.SUPER_ADMIN}`);

  /**
   * ---------------------------------------------------------
   * 7. Finished
   * ---------------------------------------------------------
   */

  console.log('');
  console.log('======================================');
  console.log(' PMS database seed completed');
  console.log('======================================');
}

main()
  .catch((error) => {
    console.error('');
    console.error('❌ PMS database seed failed');
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
