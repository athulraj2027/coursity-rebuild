import { prisma } from "../lib/prisma.js";

const getUserProfile = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

const putUserProfile = async (userId: string, data: any) => {
  return await prisma.profile.upsert({
    where: {
      userId: userId,
    },
    update: {
      bio: data.bio,
      avatarUrl: data.imageUrl,
      headline: data.headline,
      website: data.website,
      github: data.github,
      linkedin: data.linkedin,
      twitter: data.twitter,
      location: data.location,
    },
    create: {
      userId: userId,
      bio: data.bio,
      avatarUrl: data.imageUrl,
      headline: data.headline,
      website: data.website,
      github: data.github,
      linkedin: data.linkedin,
      twitter: data.twitter,
      location: data.location,
    },
  });
};

const getTeacherProfileForStudents = async (teacherId: string) => {
  const teacher = await prisma.user.findUnique({
    where: {
      id: teacherId,
      role: "TEACHER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,

      profile: {
        select: {
          avatarUrl: true,
          bio: true,
          headline: true,
          website: true,
          github: true,
          linkedin: true,
          twitter: true,
          location: true,
        },
      },

      courses: {
        where: {
          isDeleted: false,
          isDisabled: false,
        },
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          price: true,
          startDate: true,

          _count: {
            select: {
              enrollments: true,
              lectures: true,
            },
          },
        },
      },

      _count: {
        select: {
          courses: true,
        },
      },
    },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  // Aggregate totals
  const totalStudents = teacher.courses.reduce(
    (sum, c) => sum + c._count.enrollments,
    0,
  );

  const totalLectures = teacher.courses.reduce(
    (sum, c) => sum + c._count.lectures,
    0,
  );

  return {
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    createdAt: teacher.createdAt,

    profile: teacher.profile,

    stats: {
      totalCourses: teacher._count.courses,
      totalStudents,
      totalLectures,
    },

    courses: teacher.courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      price: course.price,
      startDate: course.startDate,
      totalStudents: course._count.enrollments,
      totalLectures: course._count.lectures,
    })),
  };
};

export default { getUserProfile, putUserProfile, getTeacherProfileForStudents };
