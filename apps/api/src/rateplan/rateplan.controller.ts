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
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../constants/permission.constant';
import { CreateRatePlanDto } from './dto/create-rateplan.dto';
import { UpdateRatePlanDto } from './dto/update-rateplan.dto';
import { RateplanService } from './rateplan.service';
import { GetRatePlansDto } from './dto/get-rateplans.dto';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('rateplan')
export class RateplanController {
  constructor(private readonly rateplanService: RateplanService) {}

  @Post()
  @RequirePermission(PERMISSIONS.RATES_CREATE)
  create(@Body() createRateplanDto: CreateRatePlanDto) {
    return this.rateplanService.create(createRateplanDto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.RATES_VIEW)
  findAll(@Query() query: GetRatePlansDto) {
    return this.rateplanService.findAll(query);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.RATES_VIEW)
  findOne(@Param('id') id: string) {
    return this.rateplanService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.RATES_UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateRateplanDto: UpdateRatePlanDto,
  ) {
    return this.rateplanService.update(id, updateRateplanDto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.RATES_DELETE)
  remove(@Param('id') id: string) {
    return this.rateplanService.remove(id);
  }
}
