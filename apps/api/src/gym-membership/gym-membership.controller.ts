import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { GymMembershipService } from './gym-membership.service';

import { CreateGymMembershipPlanDto } from './dto/create-gym-membership-plan.dto';
import { UpdateGymMembershipPlanDto } from './dto/update-gym-membership-plan.dto';
import { CreateGymMembershipDto } from './dto/create-gym-membership.dto';
import { UpdateGymMembershipStatusDto } from './dto/update-gym-membership-status.dto';
import { RefundGymMembershipDto } from './dto/refund-gym-membership.dto';
import { PayGymMembershipDto } from './dto/pay-gym-membership.dto';
import { GetMembershipsDto } from './dto/get-memberships.dto';

@Controller('gym')
export class GymMembershipController {
  constructor(private readonly gymService: GymMembershipService) {}

  @Post('plan')
  createPlan(@Body() dto: CreateGymMembershipPlanDto) {
    return this.gymService.createPlan(dto);
  }

  @Get('plan')
  findPlans() {
    return this.gymService.findPlans();
  }

  @Get('plan/:id')
  findPlan(@Param('id') id: string) {
    return this.gymService.findPlan(id);
  }

  @Patch('plan/:id')
  updatePlan(@Param('id') id: string, @Body() dto: UpdateGymMembershipPlanDto) {
    return this.gymService.updatePlan(id, dto);
  }

  @Patch('plans/:id/deactivate')
  deactivatePlan(@Param('id') id: string) {
    return this.gymService.deactivatePlan(id);
  }

  @Post('membership')
  createMembership(@Body() dto: CreateGymMembershipDto) {
    return this.gymService.createMembership(dto);
  }

  @Get('membership')
  findAllMemberships(@Query() query: GetMembershipsDto) {
    return this.gymService.findAllMemberships(query);
  }

  @Get('membership/:id')
  findMembership(@Param('id') id: string) {
    return this.gymService.findMembership(id);
  }

  @Patch('membership/:id/activate')
  activateMembership(@Param('id') id: string) {
    return this.gymService.activateMembership(id);
  }

  @Patch('membership/:id/suspend')
  suspendMembership(@Param('id') id: string) {
    return this.gymService.suspendMembership(id);
  }

  @Patch('membership/:id/reactivate')
  reactivateMembership(@Param('id') id: string) {
    return this.gymService.reactivateMembership(id);
  }

  @Patch('membership/:id/cancel')
  cancelMembership(
    @Param('id') id: string,
    @Body() dto: UpdateGymMembershipStatusDto,
  ) {
    return this.gymService.cancelMembership(id, dto);
  }

  @Post('membership/:id/roomcharge')
  roomCharge(@Param('id') id: string) {
    return this.gymService.roomCharge(id);
  }

  @Post('membership/:id/pay')
  pay(@Param('id') id: string, @Body() dto: PayGymMembershipDto) {
    return this.gymService.pay(id, dto);
  }

  @Post('membership/:id/refund')
  refund(@Param('id') id: string, @Body() dto: RefundGymMembershipDto) {
    return this.gymService.refund(id, dto);
  }
}
