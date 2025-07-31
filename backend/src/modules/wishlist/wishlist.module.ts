import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, WishlistItem])],
  exports: [TypeOrmModule],
})
export class WishlistModule {}