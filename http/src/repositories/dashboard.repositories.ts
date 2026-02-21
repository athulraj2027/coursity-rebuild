import { prisma } from "../lib/prisma.js";

const DashboardRepository = {
  
  async getTeacherDashboard(userId: string) {
    // 1️⃣ Courses taught
    const courses = await prisma.course.findMany({
      where: {
        teacherId: userId,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        price: true,
        isEnrollmentOpen: true,
        _count: {
          select: {
            enrollments: true,
            lectures: true,
          },
        },
      },
    });

    const courseIds = courses.map((c) => c.id);

    // 2️⃣ Total Revenue
    const revenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        courseId: { in: courseIds },
        status: "PAID",
      },
    });

    // 3️⃣ Upcoming Lectures (next 7 days)
    const upcomingLectures = await prisma.lecture.findMany({
      where: {
        courseId: { in: courseIds },
        startTime: { gte: new Date() },
        isDeleted: false,
      },
      orderBy: { startTime: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        startTime: true,
        status: true,
        course: { select: { title: true } },
      },
    });

    // 4️⃣ Average Attendance
    const attendance = await prisma.attendance.aggregate({
      _avg: { durationSec: true },
      where: {
        lecture: {
          courseId: { in: courseIds },
        },
      },
    });

    return {
      summary: {
        totalCourses: courses.length,
        totalRevenue: revenue._sum.amount || 0,
        avgAttendanceDuration: attendance._avg.durationSec || 0,
      },
      courses,
      upcomingLectures,
    };
  },
  async getStudentDashboard(userId: string) {
    // 1️⃣ Enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            teacher: { select: { name: true } },
            lectures: {
              where: { isDeleted: false },
              select: { id: true, status: true },
            },
          },
        },
        payment: true,
      },
    });

    const courseIds = enrollments.map((e) => e.courseId);

    // 2️⃣ Attendance stats
    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: userId,
        lecture: {
          courseId: { in: courseIds },
        },
      },
    });

    const totalLectures = enrollments.reduce(
      (acc, e) => acc + e.course.lectures.length,
      0,
    );

    const attendedLectures = attendance.length;

    const attendancePercent =
      totalLectures === 0
        ? 0
        : Math.round((attendedLectures / totalLectures) * 100);

    // 3️⃣ Upcoming lectures
    const upcomingLectures = await prisma.lecture.findMany({
      where: {
        courseId: { in: courseIds },
        startTime: { gte: new Date() },
        isDeleted: false,
      },
      orderBy: { startTime: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        startTime: true,
        status: true,
        course: { select: { title: true } },
      },
    });

    return {
      summary: {
        totalCourses: enrollments.length,
        attendancePercent,
      },
      enrollments,
      upcomingLectures,
    };
  },
  async getAdminDashboard() {
    // User counts
    const userStats = await prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    });

    //  Course count
    const totalCourses = await prisma.course.count({
      where: { isDeleted: false },
    });

    // Revenue
    const revenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    });

    // Payment breakdown
    const paymentBreakdown = await prisma.payment.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // Active lectures
    const activeLectures = await prisma.lecture.count({
      where: {
        status: "STARTED",
      },
    });

    return {
      users: userStats,
      totalCourses,
      totalRevenue: revenue._sum.amount || 0,
      paymentBreakdown,
      activeLectures,
    };
  },
};

export default DashboardRepository;
