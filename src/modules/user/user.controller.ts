import { Request, Response } from 'express';
import { Types, FilterQuery } from 'mongoose';
import User from './user.model';
import { IUser } from './user.interface';
import { paginateAggregation } from '../../utils/paginate_aggregation';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract pagination & sorting options from query
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const sortField = (req.query.sortField as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build filter object dynamically
    const filter: FilterQuery<IUser> = {};
    // if (req.query.roles) filter.roles = req.query.roles as string; // FIX OR TEST LATER
    if (req.query.status) filter.status = req.query.status as string;

    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { email: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // Define custom aggregation pipeline (e.g., lookup roles)
    const pipeline = [
      // {
      //   $lookup: {
      //     from: 'roles', // Assuming a Role collection exists
      //     localField: 'roleId',
      //     foreignField: '_id',
      //     as: 'roleInfo',
      //   },
      // },
      // { $unwind: { path: '$roleInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          email: 1,
          username: 1,
          roles: 1, // roles: "$roleInfo.name", // Extract role name from `roleInfo`
          status: 1,
          avatar: 1,
          name: 1,
          dob: 1,
          nationalId: 1,
          phone: 1,
          address: 1,
          baseSalary: 1,
          createdAt: 1,
          updatedAt: 1,
          referralId: 1,
        },
      },
    ];

    // Call pagination util function
    const result = await paginateAggregation(User, pipeline, {
      page,
      limit,
      sort: { [sortField]: sortOrder },
      filter,
    });

    res.json(result);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: err.message || 'Internal server error',
    });
  }
};

export const getUserStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          all: { $sum: '$count' },
          active: {
            $sum: {
              $cond: [{ $eq: ['$_id', 1] }, '$count', 0],
            },
          },
          inactive: {
            $sum: {
              $cond: [{ $eq: ['$_id', 0] }, '$count', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          all: 1,
          active: 1,
          inactive: 1,
        },
      },
    ]);

    res.json(stats[0] || { all: 0, active: 0, inactive: 0 });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: err.message || 'Internal server error',
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Aggregation to get user
    const user = await User.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      // {
      //   $lookup: {
      //     from: "roles",
      //     localField: "roleId",
      //     foreignField: "_id",
      //     as: "roleInfo",
      //   },
      // },
      // { $unwind: { path: "$roleInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          // _id: 1,
          // name: 1,
          // email: 1,
          // status: 1,
          // roles: "$roleInfo.name", // Chỉ lấy tên role
          // createdAt: 1,
          password: 0,
        },
      },
    ]);

    if (!user.length) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user[0]);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: err.message || 'Internal server error',
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      email,
      username,
      password,
      roles,
      status,
      referrerId,
      avatar,
      name,
      dob,
      nationalId,
      phone,
      address,
      baseSalary,
      bankAccount,
      socialProfile,
      bio,
    } = req.body;

    // Create new user
    const newUser = new User({
      email,
      username,
      password,
      roles: roles || [2],
      status,
      referrerId,
      avatar,
      name,
      dob,
      nationalId,
      phone,
      address,
      baseSalary,
      bankAccount,
      socialProfile,
      bio,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: err.message || 'Internal server error',
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Define allowed fields
    const allowedFields: (keyof IUser)[] = [
      'email',
      'username',
      'password',
      'roles',
      'status',
      'avatar',
      'name',
      'dob',
      'nationalId',
      'phone',
      'address',
      'baseSalary',
      'bankAccount',
      'socialProfile',
      'bio',
    ];

    const updateData: Partial<IUser> = allowedFields.reduce<Partial<IUser>>(
      (acc, field: keyof IUser) => {
        if (req.body[field] !== undefined) {
          acc[field] = req.body[field] as IUser[keyof IUser];
        }
        return acc;
      },
      {},
    );

    // Fetch the user first
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update allowed fields manually
    Object.assign(user, updateData);

    // Save user
    await user.save();

    res.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: err.message || 'Internal server error',
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: err.message || 'Internal server error',
    });
  }
};

export const activateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: 1 },
      { new: true },
    ).select('_id email status');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User activated successfully', user });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: err.message || 'Internal server error',
    });
  }
};

export const deactivateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: 0 },
      { new: true },
    ).select('_id email status');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deactivated successfully', user });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: err.message || 'Internal server error',
    });
  }
};

export default {
  getUsers,
  getUserStats,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
};
