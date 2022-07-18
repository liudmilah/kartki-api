import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql';
import { SetsService } from './sets.service';
import { NewSetInput } from './inputs/new-set.input';
import { UpdateSetInput } from './inputs/update-set.input';
import { GetSetsArgs } from './inputs/get-sets.args';
import { Set } from './schemas/set.schema';
import { User } from '../auth/schemas/user.schema';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(GqlAuthGuard)
@Resolver((of) => Set)
export class SetsResolver {
    constructor(private readonly service: SetsService) {}

    @Query((returns) => Set)
    async set(@Args('id', { type: () => ID! }) id: string): Promise<Set> {
        const set = await this.service.findOneById(id);
        if (!set) {
            throw new NotFoundException(id);
        }
        return set;
    }

    @Query((returns) => [Set])
    sets(@Args() args?: GetSetsArgs): Promise<Set[]> {
        return this.service.findAll(args.skip, args.take);
    }

    @Mutation((returns) => Set)
    async addSet(@Args('newSetData') newSetData: NewSetInput, @CurrentUser() user: User): Promise<Set> {
        return await this.service.create(newSetData, user);
    }

    @Mutation((returns) => Set)
    async updateSet(@Args('updateSetData') updateSetData: UpdateSetInput): Promise<Set> {
        return this.service.update(updateSetData);
    }

    @Mutation((returns) => Set)
    async deleteSet(@Args('id', { type: () => ID! }) id: string) {
        return this.service.delete(id);
    }
}
