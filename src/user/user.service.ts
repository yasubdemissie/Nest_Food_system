import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { prismaService } from 'src/helper/prisma.service';
import { User } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: prismaService) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    try {
      // Check if user with email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Create the user
      const createdUser = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          age: createUserDto.age,
          password: createUserDto.password,
        },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          // Don't return password for security
        },
      });

      console.log('User created successfully:', createdUser);
      return createdUser;
    } catch (error: any) {
      console.error('Error creating user:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      // Handle Prisma unique constraint errors
      // if (error.code === 'P2002') {
      //   throw new ConflictException('User with this email already exists');
      // }

      throw new HttpException(
        'Failed to create user. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Get all users
  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          createdAt: true,
          updatedAt: true,
          orders: {
            select: {
              id: true,
              createdAt: true,
              items: {
                select: {
                  id: true,
                  quantity: true,
                  product: {
                    select: {
                      name: true,
                      price: true,
                    },
                  },
                },
              },
            },
          },
          // Don't return passwords
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log(`Found ${users.length} users`);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Get user by ID
  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      console.log('User found:', user);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Get user by email
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          password: true, // Include password for authentication purposes
          createdAt: true,
          updatedAt: true,
        },
      });

      return user as User;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new HttpException(
        'Failed to fetch user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Update user
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // If email is being updated, check if it's already taken
      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: updateUserDto.email },
        });

        if (emailExists) {
          throw new ConflictException('Email is already taken by another user');
        }
      }

      // Update the user
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...(updateUserDto.name !== undefined && { name: updateUserDto.name }),
          ...(updateUserDto.email !== undefined && {
            email: updateUserDto.email,
          }),
          ...(updateUserDto.age !== undefined && { age: updateUserDto.age }),
          ...(updateUserDto.password !== undefined && {
            password: updateUserDto.password,
          }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          createdAt: true,
          updatedAt: true,
          // Don't return password
        },
      });

      console.log('User updated successfully:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Handle Prisma unique constraint errors
      // if (error?.code === 'P2002') {
      //   throw new ConflictException('Email is already taken by another user');
      // }

      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Delete user
  async remove(id: number) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
        include: {
          orders: true,
        },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Check if user has orders
      if (existingUser.orders.length > 0) {
        throw new ConflictException(
          'Cannot delete user with existing orders. Please delete orders first.',
        );
      }

      // Delete the user
      const deletedUser = await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          createdAt: true,
          // Don't return password
        },
      });

      console.log('User deleted successfully:', deletedUser);
      return {
        message: `User with ID ${id} has been successfully deleted`,
        deletedUser: deletedUser,
      };
    } catch (error) {
      console.error('Error deleting user:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const [totalUsers, usersWithOrders, ageStats, recentUsers] =
        await Promise.all([
          // Total users count
          this.prisma.user.count(),

          // Users with orders count
          this.prisma.user.count({
            where: {
              orders: {
                some: {},
              },
            },
          }),

          // Average age
          this.prisma.user.aggregate({
            _avg: {
              age: true,
            },
          }),

          // Recent users (last 10)
          this.prisma.user.findMany({
            take: 10,
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              name: true,
              email: true,
              age: true,
              createdAt: true,
            },
          }),
        ]);

      return {
        totalUsers,
        usersWithOrders,
        averageAge: ageStats._avg.age,
        recentUsers: recentUsers,
      };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw new HttpException(
        'Failed to fetch user statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Search users by name or email
  async searchUsers(query: string) {
    try {
      if (!query || query.trim().length === 0) {
        throw new HttpException(
          'Search query is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
              },
            },
            {
              email: {
                contains: query,
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          createdAt: true,
          updatedAt: true,
          // Don't return password
        },
        orderBy: {
          name: 'asc',
        },
      });

      console.log(`Found ${users.length} users matching query: ${query}`);
      return users;
    } catch (error) {
      console.error('Error searching users:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to search users',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
