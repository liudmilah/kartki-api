import { Module } from '@nestjs/common';
import { SetsResolver } from './sets.resolver';
import { SetsService } from './sets.service';
import { Set, SetSchema } from './schemas/set.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Set.name, schema: SetSchema }]),
  ],
  providers: [SetsResolver, SetsService],
})
export class SetsModule {}
