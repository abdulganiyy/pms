import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';
import { CreateRatePlanDto } from './dto/create-rateplan.dto';
import { UpdateRatePlanDto } from './dto/update-rateplan.dto';
import { RateplanService } from './rateplan.service';
import { GetRatePlansDto } from './dto/get-rateplans.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.OWNER, RoleName.FRONT_DESK_MANAGER)
@Controller('rateplan')
export class RateplanController {
  constructor(private readonly rateplanService: RateplanService) {}

  @Post()
  create(@Body() createRateplanDto: CreateRatePlanDto) {
    return this.rateplanService.create(createRateplanDto);
  }

  @Get()
  findAll(@Query() query: GetRatePlansDto) {
    return this.rateplanService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateplanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRateplanDto: UpdateRatePlanDto,
  ) {
    return this.rateplanService.update(id, updateRateplanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateplanService.remove(id);
  }
}
