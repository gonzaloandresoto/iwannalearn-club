'use server';

import { revalidatePath } from 'next/cache';

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';

import { handleError } from '@/lib/utils';

interface CreateUserParams {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
}

export async function createUser(user: CreateUserParams) {
  try {
    console.log('Creating user IN FUNCTION:', user);
    await connectToDatabase();

    const newUser = await User.create(user);
    console.log('Created user IN FUNCTION:', newUser);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: { $in: userId } });

    if (!user) throw new Error('User not found');

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface UpdateUserParams {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error('User update failed');
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath('/');

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}
