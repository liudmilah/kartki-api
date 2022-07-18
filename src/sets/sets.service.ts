import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NewSetInput } from './inputs/new-set.input';
import { UpdateSetInput } from './inputs/update-set.input';
import { Set, SetDocument } from './schemas/set.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class SetsService {
    constructor(@InjectModel(Set.name) private readonly setModel: Model<SetDocument>) {}

    async findAll(offset = 0, limit = 50): Promise<Set[]> {
        return this.setModel.find().populate('author').limit(limit).skip(offset).exec();
    }

    async findOneById(id: string): Promise<Set> {
        return this.setModel.findOne({ _id: id }).populate('author').exec();
    }

    async create(newSetData: NewSetInput, user: User): Promise<Set> {
        const data = {
            ...newSetData,
            cardsAmount: newSetData.cards.length,
            author: user._id,
        };
        const set = await this.setModel.create(data);
        set.author = user;
        return set;
    }

    async update(updateSetData: UpdateSetInput): Promise<Set> {
        const data = {
            ...updateSetData,
            cardsAmount: updateSetData.cards.length,
        };
        return this.setModel
            .findOneAndUpdate({ _id: updateSetData._id }, data, { new: true })
            .populate('author')
            .exec();
    }

    delete(id: string): Promise<Set> {
        return this.setModel.findOneAndDelete({ _id: id }).exec();
    }
}
