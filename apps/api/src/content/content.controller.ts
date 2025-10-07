import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('content')
export class ContentController {
  constructor(@InjectModel('Content') private content: Model<any>) {}

  @Get()
  async all() { return this.content.find().lean(); }

  @Post()
  async create(@Body() dto: any) { return this.content.create(dto); }
}
