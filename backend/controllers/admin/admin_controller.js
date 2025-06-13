import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

// GET /api/admin/dashboard-stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Count users by role
    const totalUsers = await prisma.user.count();
    const totalAlumni = await prisma.user.count({ where: { role: 'alumni' } });
    const totalStudents = await prisma.user.count({ where: { role: 'student' } });
    const totalFaculty = await prisma.user.count({ where: { role: 'faculty' } });
    const totalAdmins = await prisma.user.count({ where: { role: 'admin' } });

    // Example: count posts, mentorships, etc. (add your own logic if you have those tables)
    // const totalPosts = await prisma.post.count();
    // const totalMentorships = await prisma.mentorship.count();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAlumni,
        totalStudents,
        totalFaculty,
        totalAdmins,
        // totalPosts,
        // totalMentorships,
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: "Failed to fetch admin stats." });
  }
};

// GET /api/admin/profile
export const getAdminProfile = async (req, res) => {
  try {
    // Get the admin user from the DB
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { admin: true }
    });
    if (!user || user.role !== 'admin') {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        department: user.department,
        photoUrl: user.photoUrl,
        bio: user.bio,
        linkedinUrl: user.linkedinUrl,
        twitterUrl: user.twitterUrl,
        githubUrl: user.githubUrl,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ success: false, message: "Failed to fetch admin profile." });
  }
};

// POST /api/admin/create
export const createAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, department } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'fullName, email, and password are required.' });
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user and admin
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        department,
        role: 'admin',
        admin: {
          create: {}
        }
      },
      include: { admin: true }
    });
    // Return created admin (omit password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ success: false, message: 'Failed to create admin.' });
  }
};