import { prisma } from "../lib/prisma.js";

const DashboardRepository = {
  async getTeacherDashboard(userId: string) {
    console.log("user id : ", userId);
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
    // 1️⃣ User counts
    const userCounts = await prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    });

    const totalUsers = userCounts.reduce((acc, u) => acc + u._count.id, 0);
    const totalStudents =
      userCounts.find((u) => u.role === "STUDENT")?._count.id || 0;
    const totalTeachers =
      userCounts.find((u) => u.role === "TEACHER")?._count.id || 0;

    // 2️⃣ Courses
    const totalCourses = await prisma.course.count({
      where: { isDeleted: false },
    });

    // 3️⃣ Enrollments
    const totalEnrollments = await prisma.enrollment.count();

    // 4️⃣ Revenue (sum of PAID payments)
    const revenueAggregate = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    });
    const totalRevenueReceived = revenueAggregate._sum.amount || 0;

    // 5️⃣ Lectures by status
    const lectureStats = await prisma.lecture.groupBy({
      by: ["status"],
      _count: { id: true },
      where: { isDeleted: false },
    });

    const totalLectures = lectureStats.reduce((acc, l) => acc + l._count.id, 0);
    const completedLectures =
      lectureStats.find((l) => l.status === "COMPLETED")?._count.id || 0;
    const scheduledLectures =
      lectureStats.find((l) => l.status === "NOT_STARTED")?._count.id || 0;
    const liveLectures =
      lectureStats.find((l) => l.status === "STARTED")?._count.id || 0;

    return {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      totalRevenueReceived,
      totalLectures,
      completedLectures,
      scheduledLectures,
      liveLectures,
    };
  },
};

export default DashboardRepository;
