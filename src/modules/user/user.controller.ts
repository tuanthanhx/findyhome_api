import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from './user.model';
import { paginateAggregation } from '../../utils/paginate_aggregation';

const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

export const getUsers = async (req: Request, res: Response) => {
  try {
    // const users = await User.find();
    // res.json(users);

    // const { page, limit, sortBy, filter } = req.query;
    // const filterObj: Record<string, any> = filter ? { title: { $regex: filter, $options: 'i' } } : {};

    // const options = {
    //   page: Number(page) || 1,
    //   limit: Number(limit) || 10,
    //   sortBy: sortBy ? sortBy : 'createdAt:desc',
    // };

    // const result = await User.paginate(filterObj, options);
    // res.status(200).json(result);

    // const params = { page: 1, limit: 5, sort: { createdAt: -1 }, filter: { role: 2 } };
    // const users = await paginateAggregation(User, [], params);
    // res.status(200).json(users);

    // 🟢 Extract pagination & sorting options from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortField = (req.query.sortField as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // 🟢 Build filter object dynamically
    const filter: Record<string, any> = {};
    if (req.query.role) filter.role = req.query.role; // Filter by role
    if (req.query.status) filter.status = req.query.status; // Filter by status
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // 🟢 Define custom aggregation pipeline (e.g., lookup roles)
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
          role: 1, // role: "$roleInfo.name", // Extract role name from `roleInfo`
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

    // 🟢 Call pagination util function
    const result = await paginateAggregation(User, pipeline, {
      page,
      limit,
      sort: { [sortField]: sortOrder },
      filter,
    });

    return res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          all: { $sum: "$count" }, // Tổng số users
          active: {
            $sum: {
              $cond: [{ $eq: ["$_id", 1] }, "$count", 0],
            },
          },
          inactive: {
            $sum: {
              $cond: [{ $eq: ["$_id", 0] }, "$count", 0],
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

    return res.json(stats[0] || { all: 0, active: 0, inactive: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 🛑 Kiểm tra ID hợp lệ
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // 🔍 Aggregation để lấy user và thông tin role
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
          // role: "$roleInfo.name", // Chỉ lấy tên role
          // createdAt: 1,
          password: 0,
        },
      },
    ]);

    // ❌ Nếu không tìm thấy user
    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user[0]); // Trả về user đầu tiên
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// 1️⃣ Ngừng hoạt động user (status = 0)
export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status: 0 },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deactivated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 2️⃣ Hoạt động lại user (status = 1)
export const activateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status: 1 },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User activated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3️⃣ Xoá user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    // const { name, email, password, role, status } = req.body;
    const newData = { ...req.body };

    // // Kiểm tra các trường bắt buộc
    // if (!name || !email || !password) {
    //   return res.status(400).json({ message: "Name, email and password are required" });
    // }

    // TODO:
    /*
      1) Validate data
      2) Hash password
      3) General referralId
      4) Validate referrerId (if exists)
    */

    // Tạo mới user
    const newUser = new User(newData);

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// API cập nhật user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Kiểm tra tính hợp lệ của ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Lấy dữ liệu cần update từ body
    const updateData = { ...req.body };

    // Loại bỏ các trường không cho phép update
    delete updateData._id;
    delete updateData.__v;
    delete updateData.referralId;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Cập nhật user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
