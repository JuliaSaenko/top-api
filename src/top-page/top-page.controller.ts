import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { FindTopPageResponse } from './dto/find-top-page.response';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id);
    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return page;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedPage = await this.topPageService.updateById(id, dto);

    if (!updatedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return updatedPage;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias);

    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return page;
  }

  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstLevelCategory);
  }

  @Get('textSearch/:text')
  async textSearch(
    @Param('text') text: string,
  ): Promise<FindTopPageResponse[]> {
    return this.topPageService.findByText(text);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedPage = await this.topPageService.deleteById(id);
    if (!deletedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
  }
}
