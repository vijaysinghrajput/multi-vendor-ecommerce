import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum AddressType {
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other',
}

@Entity('addresses')
export class Address {
  @ApiProperty({ description: 'Address ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Address type', enum: AddressType })
  @Column({ type: 'enum', enum: AddressType, default: AddressType.HOME })
  type: AddressType;

  @ApiProperty({ description: 'First name' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'Phone number' })
  @Column()
  phone: string;

  @ApiProperty({ description: 'Address line 1' })
  @Column()
  addressLine1: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  @Column({ nullable: true })
  addressLine2?: string;

  @ApiProperty({ description: 'City' })
  @Column()
  city: string;

  @ApiProperty({ description: 'State' })
  @Column()
  state: string;

  @ApiProperty({ description: 'Postal code' })
  @Column()
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  @Column()
  country: string;

  @ApiProperty({ description: 'Landmark', required: false })
  @Column({ nullable: true })
  landmark?: string;

  @ApiProperty({ description: 'Is default address' })
  @Column({ default: false })
  isDefault: boolean;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Address creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Address last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Virtual properties
  @ApiProperty({ description: 'Full name' })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  @ApiProperty({ description: 'Full address' })
  get fullAddress(): string {
    const parts = [
      this.addressLine1,
      this.addressLine2,
      this.city,
      this.state,
      this.postalCode,
      this.country,
    ].filter(Boolean);
    return parts.join(', ');
  }
}