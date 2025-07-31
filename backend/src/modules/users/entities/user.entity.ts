import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Address } from '../../address/entities/address.entity';
import { Notification } from '../../notifications/entities/notification.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true, where: 'phone IS NOT NULL' })
@Index(['role'])
@Index(['status'])
export class User {
  @ApiProperty({ description: 'User unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @Column({ unique: true })
  @Index()
  email: string;

  @ApiProperty({ description: 'User phone number', example: '+1234567890', required: false })
  @Column({ nullable: true, unique: true })
  @Index()
  phone?: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'password_hash', nullable: true })
  password?: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @Column({ name: 'first_name' })
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @Column({ name: 'last_name' })
  lastName: string;

  @ApiProperty({ description: 'User avatar URL', required: false })
  @Column({ name: 'avatar_url', nullable: true })
  avatar?: string;

  @ApiProperty({ description: 'User date of birth', required: false })
  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'User gender', enum: ['male', 'female', 'other'], required: false })
  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender?: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @ApiProperty({ description: 'User status', enum: UserStatus })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @ApiProperty({ description: 'Authentication provider', enum: AuthProvider })
  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
  authProvider: AuthProvider;

  @ApiProperty({ description: 'External provider ID', required: false })
  @Column({ nullable: true })
  providerId?: string;

  @ApiProperty({ description: 'Email verification status' })
  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @ApiProperty({ description: 'Phone verification status' })
  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @ApiProperty({ description: 'Two-factor authentication enabled' })
  @Column({ name: 'two_factor_enabled', default: false })
  twoFactorEnabled: boolean;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'two_factor_secret', nullable: true })
  twoFactorSecret?: string;

  @ApiProperty({ description: 'User preferred language', example: 'en' })
  @Column({ default: 'en' })
  language: string;

  @ApiProperty({ description: 'User preferred currency', example: 'USD' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'User timezone', example: 'UTC' })
  @Column({ default: 'UTC' })
  timezone: string;

  @ApiProperty({ description: 'Marketing emails consent' })
  @Column({ name: 'marketing_consent', default: false })
  marketingConsent: boolean;

  @ApiProperty({ description: 'Push notifications enabled' })
  @Column({ name: 'push_notifications', default: true })
  pushNotifications: boolean;

  @ApiProperty({ description: 'Email notifications enabled' })
  @Column({ name: 'email_notifications', default: true })
  emailNotifications: boolean;

  @ApiProperty({ description: 'SMS notifications enabled' })
  @Column({ name: 'sms_notifications', default: false })
  smsNotifications: boolean;

  @ApiProperty({ description: 'Last login timestamp', required: false })
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @ApiProperty({ description: 'Last login IP address', required: false })
  @Column({ name: 'last_login_ip', nullable: true })
  lastLoginIp?: string;

  @ApiProperty({ description: 'Login attempts count' })
  @Column({ name: 'login_attempts', default: 0 })
  loginAttempts: number;

  @ApiProperty({ description: 'Account locked until', required: false })
  @Column({ name: 'locked_until', type: 'timestamp', nullable: true })
  lockedUntil?: Date;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'reset_password_token', nullable: true })
  resetPasswordToken?: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'reset_password_expires', type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'email_verification_token', nullable: true })
  emailVerificationToken?: string;

  @ApiProperty({ description: 'User creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'User last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'User orders', type: () => [Order] })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ApiProperty({ description: 'User reviews', type: () => [Review] })
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @ApiProperty({ description: 'User cart', type: () => Cart })
  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart: Cart;

  @ApiProperty({ description: 'User wishlist', type: () => Wishlist })
  @OneToOne(() => Wishlist, (wishlist) => wishlist.user)
  @JoinColumn()
  wishlist: Wishlist;

  @ApiProperty({ description: 'User addresses', type: () => [Address] })
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @ApiProperty({ description: 'User notifications', type: () => [Notification] })
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  // Virtual properties
  @ApiProperty({ description: 'User full name' })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  @ApiProperty({ description: 'User display name' })
  get displayName(): string {
    return this.fullName || this.email;
  }

  @ApiProperty({ description: 'User initials' })
  get initials(): string {
    const firstInitial = this.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  @ApiProperty({ description: 'Account locked status' })
  get isLocked(): boolean {
    return this.lockedUntil && this.lockedUntil > new Date();
  }

  @ApiProperty({ description: 'Account verified status' })
  get isVerified(): boolean {
    return this.emailVerified && (this.phone ? this.phoneVerified : true);
  }

  // Methods
  incrementLoginAttempts(): void {
    this.loginAttempts += 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (this.loginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }
  }

  resetLoginAttempts(): void {
    this.loginAttempts = 0;
    this.lockedUntil = null;
  }

  updateLastLogin(ip?: string): void {
    this.lastLoginAt = new Date();
    this.lastLoginIp = ip;  
    this.resetLoginAttempts();
  }
}