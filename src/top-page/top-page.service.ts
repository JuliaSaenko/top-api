import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
    return this.topPageModel.create(dto);
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndRemove(id).exec();
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async findByText(text: string) {
    return this.topPageModel
      .find({
        $text: {
          $search: text,
          $caseSensitive: false,
        },
      })
      .exec();
  }

  async findByCategory(firstLevelCategory: TopLevelCategory) {
    return this.topPageModel
      .aggregate()
      .match({
        firstLevelCategory,
      })
      .group({
        _id: { secondCategory: '$secondLevelCategory' },
        pages: {
          $push: {
            alias: '$alias',
            title: '$title',
            _id: '$_id',
            category: '$category',
          },
        },
      })
      .exec();
  }
}
