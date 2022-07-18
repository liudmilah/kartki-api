import { Test, TestingModule } from '@nestjs/testing';
import { SetsService } from './sets.service';
import { getModelToken } from '@nestjs/mongoose';
import { Set } from './schemas/set.schema';
import { Model } from 'mongoose';
describe('SetsService', () => {
    let service: SetsService;
    let model: Model<Set>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SetsService,
                {
                    provide: getModelToken('Set'),
                    useValue: {
                        new: jest.fn().mockResolvedValue({}),
                        constructor: jest.fn().mockResolvedValue({}),
                        find: jest.fn(),
                        create: jest.fn(),
                        findOne: jest.fn(),
                        findOneAndUpdate: jest.fn(),
                        findOneAndDelete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SetsService>(SetsService);
        model = module.get<Model<Set>>(getModelToken('Set'));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
